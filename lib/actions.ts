"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendUrgentIncidentEmail, sendWelcomeEmail } from "@/lib/email";

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("No autenticado");
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
}

async function verifyProjectOwnership(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });
  if (!project) {
    throw new Error("Acceso no autorizado: la obra no pertenece a este usuario");
  }
  return project;
}

// CERROJO 2: Verificación de período de prueba de 14 días
function checkUserTrial(user: any) {
  const isPro = user.plan === "PRO" || user.plan === "ENTERPRISE";
  if (isPro) return;

  if (user.trialEndsAt) {
    const isExpired = new Date() > new Date(user.trialEndsAt);
    if (isExpired) {
      throw new Error("TRIAL_EXPIRED");
    }
  }
}

// ================= PROJECTS =================
export async function createProject(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  
  // Freemium limit: Free tier allows maximum 1 active project
  const isPro = user.plan === "PRO" || user.plan === "ENTERPRISE";
  if (!isPro) {
    const projectCount = await prisma.project.count({
      where: { userId: user.id },
    });
    if (projectCount >= 1) {
      throw new Error("PLAN_LIMIT_PROJECTS");
    }
  }

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const location = (formData.get("location") as string) || "";
  const clientName = (formData.get("clientName") as string) || "";
  const budget = parseFloat((formData.get("budget") as string) || "0");
  const status = (formData.get("status") as string) || "EN_EJECUCION";
  const endDateStr = formData.get("endDate") as string;

  if (!name || name.trim() === "") {
    throw new Error("El nombre de la obra es obligatorio");
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      location,
      clientName,
      budget,
      spent: 0,
      progress: 0,
      status,
      endDate: endDateStr ? new Date(endDateStr) : null,
      userId: user.id,
      milestones: {
        create: [
          { title: "Planificación y Permisos de Obra", order: 1, completed: true },
          { title: "Cimentación y Movimiento de Tierras", order: 2, completed: false },
          { title: "Estructura de Hormigón / Acero", order: 3, completed: false },
          { title: "Cerramientos y Albañilería", order: 4, completed: false },
          { title: "Instalaciones (Fontanería, Electricidad, Clima)", order: 5, completed: false },
          { title: "Acabados y Entrega Final", order: 6, completed: false },
        ],
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proyectos");
  return project;
}

export async function deleteProject(projectId: string) {
  const user = await getAuthenticatedUser();
  await prisma.project.deleteMany({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proyectos");
}

export async function updateProject(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string) || "";
  const location = (formData.get("location") as string) || "";
  const clientName = (formData.get("clientName") as string) || "";
  const budget = parseFloat((formData.get("budget") as string) || "0");
  const status = (formData.get("status") as string) || "EN_EJECUCION";
  const endDateStr = formData.get("endDate") as string;

  if (!name) throw new Error("El nombre de la obra es obligatorio");

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      description,
      location,
      clientName,
      budget,
      status,
      endDate: endDateStr ? new Date(endDateStr) : null,
    },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

export async function generateClientToken(projectId: string) {
  const user = await getAuthenticatedUser();
  await verifyProjectOwnership(projectId, user.id);

  const token = crypto.randomUUID();
  await prisma.project.update({
    where: { id: projectId },
    data: { clientToken: token },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  return token;
}

export async function revokeClientToken(projectId: string) {
  const user = await getAuthenticatedUser();
  await verifyProjectOwnership(projectId, user.id);

  await prisma.project.update({
    where: { id: projectId },
    data: { clientToken: null },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
}

export async function updateProjectStatus(projectId: string, status: string) {
  const user = await getAuthenticatedUser();
  await prisma.project.updateMany({
    where: {
      id: projectId,
      userId: user.id,
    },
    data: { status },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

// ================= MILESTONES =================
export async function toggleMilestone(milestoneId: string, projectId: string) {
  const user = await getAuthenticatedUser();
  await verifyProjectOwnership(projectId, user.id);
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
  });

  if (!milestone) return;

  const newCompleted = !milestone.completed;
  await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      completed: newCompleted,
      completedAt: newCompleted ? new Date() : null,
    },
  });

  // Calculate updated project progress
  const allMilestones = await prisma.milestone.findMany({
    where: { projectId },
  });
  if (allMilestones.length > 0) {
    const completedCount = allMilestones.filter((m) => m.id === milestoneId ? newCompleted : m.completed).length;
    const progress = Math.round((completedCount / allMilestones.length) * 100);
    await prisma.project.update({
      where: { id: projectId },
      data: { progress },
    });
  }

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

export async function addMilestone(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const title = (formData.get("title") as string)?.trim().slice(0, 150);
  const description = ((formData.get("description") as string) || "").slice(0, 500);

  if (!title) return;

  await prisma.milestone.create({
    data: {
      projectId,
      title,
      description,
      completed: false,
    },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
}

export async function updateMilestone(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const milestoneId = formData.get("id") as string;
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const title = (formData.get("title") as string)?.trim().slice(0, 150);
  const description = ((formData.get("description") as string) || "").slice(0, 500);

  if (!title) return;

  await prisma.milestone.updateMany({
    where: { id: milestoneId, projectId },
    data: { title, description },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
}

export async function deleteMilestone(milestoneId: string, projectId: string) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  await verifyProjectOwnership(projectId, user.id);

  await prisma.milestone.deleteMany({
    where: { id: milestoneId, projectId },
  });

  // Calculate updated project progress
  const allMilestones = await prisma.milestone.findMany({
    where: { projectId },
  });
  const progress = allMilestones.length > 0
    ? Math.round((allMilestones.filter((m) => m.completed).length / allMilestones.length) * 100)
    : 0;

  await prisma.project.update({
    where: { id: projectId },
    data: { progress },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

// ================= DAILY REPORTS =================
export async function addDailyReport(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const title = (formData.get("title") as string)?.trim().slice(0, 150);
  const notes = (formData.get("notes") as string)?.trim().slice(0, 2000);
  const weather = (formData.get("weather") as string) || "Soleado";
  const workersCount = Math.max(0, parseInt((formData.get("workersCount") as string) || "0", 10));
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const signatureUrl = (formData.get("signatureUrl") as string) || null;

  if (imageUrl && imageUrl.length > 5 * 1024 * 1024) {
    throw new Error("La fotografía adjunta no puede superar 5 MB");
  }

  if (!title || !notes) return;

  await prisma.dailyReport.create({
    data: {
      projectId,
      title,
      notes,
      weather,
      workersCount,
      imageUrl,
      signatureUrl,
    },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

export async function updateDailyReport(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const reportId = formData.get("id") as string;
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const title = (formData.get("title") as string)?.trim().slice(0, 150);
  const notes = (formData.get("notes") as string)?.trim().slice(0, 2000);
  const weather = (formData.get("weather") as string) || "Soleado";
  const workersCount = Math.max(0, parseInt((formData.get("workersCount") as string) || "0", 10));
  const imageUrl = formData.get("imageUrl") as string | null;
  const signatureUrl = formData.get("signatureUrl") as string | null;

  if (!title || !notes) return;

  const dataToUpdate: any = {
    title,
    notes,
    weather,
    workersCount,
  };
  if (imageUrl !== null && imageUrl !== undefined) {
    dataToUpdate.imageUrl = imageUrl || null;
  }
  if (signatureUrl !== null && signatureUrl !== undefined) {
    dataToUpdate.signatureUrl = signatureUrl || null;
  }

  await prisma.dailyReport.updateMany({
    where: { id: reportId, projectId },
    data: dataToUpdate,
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

export async function deleteDailyReport(reportId: string, projectId: string) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  await verifyProjectOwnership(projectId, user.id);

  await prisma.dailyReport.deleteMany({
    where: { id: reportId, projectId },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

// ================= INCIDENTS =================
export async function addIncident(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const title = (formData.get("title") as string)?.trim().slice(0, 150);
  const description = (formData.get("description") as string)?.trim().slice(0, 1000);
  const priority = (formData.get("priority") as string) || "MEDIA";
  const assignedTo = ((formData.get("assignedTo") as string) || "").slice(0, 100);

  if (!title || !description) return;

  await prisma.incident.create({
    data: {
      projectId,
      title,
      description,
      priority,
      status: "ABIERTA",
      assignedTo,
    },
  });

  if (priority === "ALTA" || priority === "URGENTE") {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { name: true } });
    if (user.email && project) {
      sendUrgentIncidentEmail(user.email, project.name, title, priority, assignedTo).catch(() => {});
    }
  }

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

export async function updateIncident(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const incidentId = formData.get("id") as string;
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const title = (formData.get("title") as string)?.trim().slice(0, 150);
  const description = (formData.get("description") as string)?.trim().slice(0, 1000);
  const priority = (formData.get("priority") as string) || "MEDIA";
  const status = (formData.get("status") as string) || "ABIERTA";
  const assignedTo = ((formData.get("assignedTo") as string) || "").slice(0, 100);

  if (!title || !description) return;

  await prisma.incident.updateMany({
    where: { id: incidentId, projectId },
    data: {
      title,
      description,
      priority,
      status,
      assignedTo,
    },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

export async function deleteIncident(incidentId: string, projectId: string) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  await verifyProjectOwnership(projectId, user.id);

  await prisma.incident.deleteMany({
    where: { id: incidentId, projectId },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

export async function resolveIncident(incidentId: string, projectId: string) {
  const user = await getAuthenticatedUser();
  await verifyProjectOwnership(projectId, user.id);
  await prisma.incident.updateMany({
    where: { id: incidentId, projectId },
    data: { status: "RESUELTA" },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard");
}

// ================= EXPENSES / FINANCE =================
export async function addExpense(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const concept = (formData.get("concept") as string)?.trim().slice(0, 150);
  const category = (formData.get("category") as string) || "MATERIALES";
  const amount = parseFloat((formData.get("amount") as string) || "0");
  const supplier = ((formData.get("supplier") as string) || "").slice(0, 100);
  const invoiceNumber = ((formData.get("invoiceNumber") as string) || "").slice(0, 50);
  const status = (formData.get("status") as string) || "PAGADO";

  if (!concept || isNaN(amount) || amount <= 0 || amount > 100000000) return;

  await prisma.expense.create({
    data: {
      projectId,
      concept,
      category,
      amount,
      supplier,
      invoiceNumber,
      status,
    },
  });

  // Update total spent for project
  const allExpenses = await prisma.expense.findMany({
    where: { projectId },
  });
  const totalSpent = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  await prisma.project.update({
    where: { id: projectId },
    data: { spent: totalSpent },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard");
}

export async function updateExpense(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const expenseId = formData.get("id") as string;
  const projectId = formData.get("projectId") as string;
  await verifyProjectOwnership(projectId, user.id);
  const concept = (formData.get("concept") as string)?.trim().slice(0, 150);
  const category = (formData.get("category") as string) || "MATERIALES";
  const amount = parseFloat((formData.get("amount") as string) || "0");
  const supplier = ((formData.get("supplier") as string) || "").slice(0, 100);
  const invoiceNumber = ((formData.get("invoiceNumber") as string) || "").slice(0, 50);
  const status = (formData.get("status") as string) || "PAGADO";

  if (!concept || isNaN(amount) || amount <= 0 || amount > 100000000) return;

  await prisma.expense.updateMany({
    where: { id: expenseId, projectId },
    data: {
      concept,
      category,
      amount,
      supplier,
      invoiceNumber,
      status,
    },
  });

  // Update total spent for project
  const allExpenses = await prisma.expense.findMany({
    where: { projectId },
  });
  const totalSpent = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  await prisma.project.update({
    where: { id: projectId },
    data: { spent: totalSpent },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard");
}

export async function deleteExpense(expenseId: string, projectId: string) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  await verifyProjectOwnership(projectId, user.id);

  await prisma.expense.deleteMany({
    where: { id: expenseId, projectId },
  });

  // Update total spent for project
  const allExpenses = await prisma.expense.findMany({
    where: { projectId },
  });
  const totalSpent = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  await prisma.project.update({
    where: { id: projectId },
    data: { spent: totalSpent },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard");
}

// ================= TEAM MEMBERS =================
export async function addTeamMember(formData: FormData) {
  const user = await getAuthenticatedUser();

  // Freemium limit: Free tier allows maximum 2 team members
  const isPro = user.plan === "PRO" || user.plan === "ENTERPRISE";
  if (!isPro) {
    const memberCount = await prisma.teamMember.count({
      where: { userId: user.id },
    });
    if (memberCount >= 2) {
      throw new Error("PLAN_LIMIT_TEAM");
    }
  }

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const email = (formData.get("email") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const company = (formData.get("company") as string) || "";

  if (!name || !role) return;

  await prisma.teamMember.create({
    data: {
      userId: user.id,
      name,
      role,
      email,
      phone,
      company,
      status: "ACTIVO",
    },
  });

  revalidatePath("/dashboard/equipo");
  revalidatePath("/dashboard");
}

export async function deleteTeamMember(memberId: string) {
  const user = await getAuthenticatedUser();
  await prisma.teamMember.deleteMany({
    where: {
      id: memberId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/equipo");
  revalidatePath("/dashboard");
}

// ================= SUBSCRIPTION =================
export async function upgradeToPro() {
  const user = await getAuthenticatedUser();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "PRO",
      subscriptionStatus: "ACTIVE",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard/equipo");
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard/suscripcion");
}

export async function downgradeToFree() {
  const user = await getAuthenticatedUser();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "FREE",
      subscriptionStatus: "ACTIVE",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard/equipo");
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard/suscripcion");
}

// ================= AUTH =================
export async function registerUser(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "Jefe de Obra";
  const cif = (formData.get("cif") as string)?.toUpperCase().trim();
  const companyName = (formData.get("companyName") as string)?.trim();

  if (!name || !email || !password || !cif) {
    throw new Error("Nombre, email, contraseña y CIF/NIF de la empresa son obligatorios");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Este correo electrónico ya está registrado");
  }

  // CERROJO 3: Control único por CIF/NIF para evitar multicuentas fraudulentas
  const existingCif = await prisma.user.findFirst({
    where: { cif },
  });

  if (existingCif) {
    throw new Error(`El CIF/NIF (${cif}) ya tiene una cuenta registrada en ObraClick. Para mantener el histórico y la trazabilidad de tus obras, inicia sesión con la cuenta de tu empresa o activa el Plan PRO.`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // CERROJO 2: Período de prueba de 14 días
  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      cif,
      companyName: companyName || name,
      trialEndsAt,
      plan: "FREE",
      subscriptionStatus: "ACTIVE",
    },
  });

  if (user.email) {
    sendWelcomeEmail(user.email, user.name || "Constructor").catch(() => {});
  }

  return { success: true, email: user.email };
}

// ================= GDPR & COMPLIANCE =================
export async function exportUserData() {
  const user = await getAuthenticatedUser();
  const fullData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      subscriptionStatus: true,
      projects: {
        include: {
          milestones: true,
          expenses: true,
          dailyReports: true,
          incidents: true,
        },
      },
      teamMembers: true,
    },
  });

  return fullData;
}

export async function deleteUserAccount() {
  const user = await getAuthenticatedUser();
  await prisma.user.delete({
    where: { id: user.id },
  });

  return { success: true };
}
