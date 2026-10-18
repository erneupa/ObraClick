"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendUrgentIncidentEmail, sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site";

// ================= HELPERS =================
//
// NOTA: en producción Next.js oculta el mensaje de los errores lanzados desde
// Server Actions (el cliente solo recibe un texto genérico). Por eso las acciones
// cuyo error debe verse en pantalla (registro, crear obra, equipo, planes) devuelven
// un objeto de resultado en lugar de lanzar una excepción.

const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_AMOUNT = 100_000_000;
const MAX_PHOTO_CHARS = 5 * 1024 * 1024;
const MAX_SIGNATURE_CHARS = 512 * 1024;

const PROJECT_STATUSES = ["PLANIFICACION", "EN_EJECUCION", "PARALIZADA", "FINALIZADA"] as const;
const INCIDENT_PRIORITIES = ["BAJA", "MEDIA", "ALTA", "URGENTE"] as const;
// La interfaz usa EN_PROCESO; EN_REVISION se mantiene por compatibilidad con datos antiguos.
const INCIDENT_STATUSES = ["ABIERTA", "EN_PROCESO", "EN_REVISION", "RESUELTA"] as const;
const EXPENSE_CATEGORIES = ["MATERIALES", "MANO_DE_OBRA", "MAQUINARIA", "SUBCONTRATAS", "OTROS"] as const;
const EXPENSE_STATUSES = ["PAGADO", "PENDIENTE", "EN_REVISION"] as const;
const REGISTER_ROLES = [
  "Jefe de Obra",
  "Arquitecto / Aparejador",
  "Empresa Constructora",
  "Promotor Inmobiliario",
] as const;

function readText(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function readChoice<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
  fallback: T
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/** Importe en euros: devuelve null si no es un número válido entre 0 y MAX_AMOUNT. */
function readAmount(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = parseFloat(value.replace(",", "."));
  if (!Number.isFinite(n) || n < 0 || n > MAX_AMOUNT) return null;
  return Math.round(n * 100) / 100;
}

function readCount(value: FormDataEntryValue | null, max = 10000): number {
  const n = typeof value === "string" ? parseInt(value, 10) : 0;
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
}

function readDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function validateImageData(value: string, maxChars: number, label: string): string {
  if (!value.startsWith("data:image/")) {
    throw new Error(`${label} no es una imagen válida`);
  }
  if (value.length > maxChars) {
    throw new Error(`${label} es demasiado grande`);
  }
  return value;
}

function fail<C extends string>(code: C, error: string) {
  return { ok: false as const, code, error };
}

type TrialInfo = { plan: string | null; trialEndsAt: Date | null };

function isProPlan(plan: string | null | undefined): boolean {
  return plan === "PRO" || plan === "ENTERPRISE";
}

// CERROJO 2: Verificación de período de prueba de 14 días
function isTrialExpired(user: TrialInfo): boolean {
  if (isProPlan(user.plan)) return false;
  return !!user.trialEndsAt && new Date() > new Date(user.trialEndsAt);
}

function checkUserTrial(user: TrialInfo) {
  if (isTrialExpired(user)) {
    throw new Error("TRIAL_EXPIRED");
  }
}

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

/** Recalcula el % de avance de la obra a partir de sus hitos. */
async function recalcProgress(projectId: string) {
  const [total, done] = await Promise.all([
    prisma.milestone.count({ where: { projectId } }),
    prisma.milestone.count({ where: { projectId, completed: true } }),
  ]);
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  await prisma.project.update({
    where: { id: projectId },
    data: { progress },
  });
}

/** Recalcula el gasto total de la obra a partir de sus gastos. */
async function recalcSpent(projectId: string) {
  const agg = await prisma.expense.aggregate({
    where: { projectId },
    _sum: { amount: true },
  });
  const spent = Math.round((agg._sum.amount ?? 0) * 100) / 100;
  await prisma.project.update({
    where: { id: projectId },
    data: { spent },
  });
}

// ================= PROJECTS =================
export async function createProject(formData: FormData) {
  const user = await getAuthenticatedUser();

  if (isTrialExpired(user)) {
    return fail("TRIAL_EXPIRED", "Tu período de prueba de 14 días ha finalizado.");
  }

  // Freemium limit: Free tier allows maximum 1 active project
  if (!isProPlan(user.plan)) {
    const projectCount = await prisma.project.count({
      where: { userId: user.id },
    });
    if (projectCount >= 1) {
      return fail("PLAN_LIMIT_PROJECTS", "Has alcanzado el límite de obras del Plan Gratuito.");
    }
  }

  const name = readText(formData.get("name"), 150);
  const description = readText(formData.get("description"), 2000);
  const location = readText(formData.get("location"), 200);
  const clientName = readText(formData.get("clientName"), 150);
  const status = readChoice(formData.get("status"), PROJECT_STATUSES, "EN_EJECUCION");

  if (!name) {
    return fail("INVALID", "El nombre de la obra es obligatorio");
  }

  const budgetRaw = readText(formData.get("budget"), 30);
  const budget = budgetRaw === "" ? 0 : readAmount(budgetRaw);
  if (budget === null) {
    return fail("INVALID", "El presupuesto indicado no es válido");
  }

  const endDateRaw = readText(formData.get("endDate"), 40);
  const endDate = readDate(endDateRaw);
  if (endDateRaw && !endDate) {
    return fail("INVALID", "La fecha de fin indicada no es válida");
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      location,
      clientName,
      budget,
      spent: 0,
      // El primer hito ("Planificación y Permisos") nace completado: 1 de 6 = 17 %
      progress: 17,
      status,
      endDate,
      userId: user.id,
      milestones: {
        create: [
          { title: "Planificación y Permisos de Obra", order: 1, completed: true, completedAt: new Date() },
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
  return { ok: true as const, projectId: project.id };
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

  if (isTrialExpired(user)) {
    return fail("TRIAL_EXPIRED", "Tu período de prueba ha finalizado.");
  }

  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);

  const name = readText(formData.get("name"), 150);
  const description = readText(formData.get("description"), 2000);
  const location = readText(formData.get("location"), 200);
  const clientName = readText(formData.get("clientName"), 150);
  const status = readChoice(formData.get("status"), PROJECT_STATUSES, "EN_EJECUCION");

  if (!name) {
    return fail("INVALID", "El nombre de la obra es obligatorio");
  }

  const budgetRaw = readText(formData.get("budget"), 30);
  const budget = budgetRaw === "" ? 0 : readAmount(budgetRaw);
  if (budget === null) {
    return fail("INVALID", "El presupuesto indicado no es válido");
  }

  const endDateRaw = readText(formData.get("endDate"), 40);
  const endDate = readDate(endDateRaw);
  if (endDateRaw && !endDate) {
    return fail("INVALID", "La fecha de fin indicada no es válida");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      description,
      location,
      clientName,
      budget,
      status,
      endDate,
    },
  });

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
  return { ok: true as const };
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
  if (!(PROJECT_STATUSES as readonly string[]).includes(status)) return;

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
  checkUserTrial(user);
  await verifyProjectOwnership(projectId, user.id);

  // El hito debe pertenecer a la obra verificada (evita tocar hitos de otras obras)
  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, projectId },
  });

  if (!milestone) return;

  const newCompleted = !milestone.completed;
  await prisma.milestone.update({
    where: { id: milestone.id },
    data: {
      completed: newCompleted,
      completedAt: newCompleted ? new Date() : null,
    },
  });

  await recalcProgress(projectId);

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

export async function addMilestone(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const title = readText(formData.get("title"), 150);
  const description = readText(formData.get("description"), 500);

  if (!title) {
    throw new Error("El título del hito constructivo es obligatorio");
  }

  // Mantener el orden: el nuevo hito va al final
  const last = await prisma.milestone.aggregate({
    where: { projectId },
    _max: { order: true },
  });

  await prisma.milestone.create({
    data: {
      projectId,
      title,
      description,
      order: (last._max.order ?? 0) + 1,
      completed: false,
    },
  });

  // Al añadir un hito cambia la proporción de hitos completados
  await recalcProgress(projectId);

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

export async function updateMilestone(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const milestoneId = readText(formData.get("id"), 100);
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const title = readText(formData.get("title"), 150);
  const description = readText(formData.get("description"), 500);

  if (!title) {
    throw new Error("El título del hito constructivo es obligatorio");
  }

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

  await recalcProgress(projectId);

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard");
}

// ================= DAILY REPORTS =================
export async function addDailyReport(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const title = readText(formData.get("title"), 150);
  const notes = readText(formData.get("notes"), 2000);
  const weather = readText(formData.get("weather"), 40) || "Soleado";
  const workersCount = readCount(formData.get("workersCount"));

  const imageRaw = formData.get("imageUrl");
  const signatureRaw = formData.get("signatureUrl");
  const imageUrl =
    typeof imageRaw === "string" && imageRaw
      ? validateImageData(imageRaw, MAX_PHOTO_CHARS, "La fotografía adjunta")
      : null;
  const signatureUrl =
    typeof signatureRaw === "string" && signatureRaw
      ? validateImageData(signatureRaw, MAX_SIGNATURE_CHARS, "La firma")
      : null;

  if (!title || !notes) {
    throw new Error("El título y las notas descriptivas del parte diario son obligatorios");
  }

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
  const reportId = readText(formData.get("id"), 100);
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const title = readText(formData.get("title"), 150);
  const notes = readText(formData.get("notes"), 2000);
  const weather = readText(formData.get("weather"), 40) || "Soleado";
  const workersCount = readCount(formData.get("workersCount"));
  const imageRaw = formData.get("imageUrl");
  const signatureRaw = formData.get("signatureUrl");

  if (!title || !notes) {
    throw new Error("El título y las notas descriptivas del parte diario son obligatorios");
  }

  const dataToUpdate: {
    title: string;
    notes: string;
    weather: string;
    workersCount: number;
    imageUrl?: string | null;
    signatureUrl?: string | null;
  } = {
    title,
    notes,
    weather,
    workersCount,
  };
  // Campo ausente = no tocar; cadena vacía = borrar; valor = reemplazar
  if (typeof imageRaw === "string") {
    dataToUpdate.imageUrl = imageRaw
      ? validateImageData(imageRaw, MAX_PHOTO_CHARS, "La fotografía adjunta")
      : null;
  }
  if (typeof signatureRaw === "string") {
    dataToUpdate.signatureUrl = signatureRaw
      ? validateImageData(signatureRaw, MAX_SIGNATURE_CHARS, "La firma")
      : null;
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
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const title = readText(formData.get("title"), 150);
  const description = readText(formData.get("description"), 1000);
  const priority = readChoice(formData.get("priority"), INCIDENT_PRIORITIES, "MEDIA");
  const assignedTo = readText(formData.get("assignedTo"), 100);

  if (!title || !description) {
    throw new Error("El título y la descripción de la incidencia son obligatorios");
  }

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
  const incidentId = readText(formData.get("id"), 100);
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const title = readText(formData.get("title"), 150);
  const description = readText(formData.get("description"), 1000);
  const priority = readChoice(formData.get("priority"), INCIDENT_PRIORITIES, "MEDIA");
  const status = readChoice(formData.get("status"), INCIDENT_STATUSES, "ABIERTA");
  const assignedTo = readText(formData.get("assignedTo"), 100);

  if (!title || !description) {
    throw new Error("El título y la descripción de la incidencia son obligatorios");
  }

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
  checkUserTrial(user);
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
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const concept = readText(formData.get("concept"), 150);
  const category = readChoice(formData.get("category"), EXPENSE_CATEGORIES, "MATERIALES");
  const amount = readAmount(formData.get("amount"));
  const supplier = readText(formData.get("supplier"), 100);
  const invoiceNumber = readText(formData.get("invoiceNumber"), 50);
  const status = readChoice(formData.get("status"), EXPENSE_STATUSES, "PAGADO");

  if (!concept) {
    throw new Error("El concepto del gasto o partida es obligatorio");
  }
  if (amount === null || amount <= 0) {
    throw new Error("El importe del gasto debe ser un número válido superior a 0");
  }

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

  await recalcSpent(projectId);

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard");
}

export async function updateExpense(formData: FormData) {
  const user = await getAuthenticatedUser();
  checkUserTrial(user);
  const expenseId = readText(formData.get("id"), 100);
  const projectId = readText(formData.get("projectId"), 100);
  await verifyProjectOwnership(projectId, user.id);
  const concept = readText(formData.get("concept"), 150);
  const category = readChoice(formData.get("category"), EXPENSE_CATEGORIES, "MATERIALES");
  const amount = readAmount(formData.get("amount"));
  const supplier = readText(formData.get("supplier"), 100);
  const invoiceNumber = readText(formData.get("invoiceNumber"), 50);
  const status = readChoice(formData.get("status"), EXPENSE_STATUSES, "PAGADO");

  if (!concept) {
    throw new Error("El concepto del gasto o partida es obligatorio");
  }
  if (amount === null || amount <= 0) {
    throw new Error("El importe del gasto debe ser un número válido superior a 0");
  }

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

  await recalcSpent(projectId);

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

  await recalcSpent(projectId);

  revalidatePath(`/dashboard/proyectos/${projectId}`);
  revalidatePath("/dashboard/finanzas");
  revalidatePath("/dashboard");
}

// ================= TEAM MEMBERS =================
export async function addTeamMember(formData: FormData) {
  const user = await getAuthenticatedUser();

  if (isTrialExpired(user)) {
    return fail("TRIAL_EXPIRED", "Tu período de prueba de 14 días ha finalizado.");
  }

  // Freemium limit: Free tier allows maximum 2 team members
  if (!isProPlan(user.plan)) {
    const memberCount = await prisma.teamMember.count({
      where: { userId: user.id },
    });
    if (memberCount >= 2) {
      return fail("PLAN_LIMIT_TEAM", "Has alcanzado el límite de colaboradores del Plan Gratuito.");
    }
  }

  const name = readText(formData.get("name"), 100);
  const role = readText(formData.get("role"), 100);
  const email = readText(formData.get("email"), 150);
  const phone = readText(formData.get("phone"), 40);
  const company = readText(formData.get("company"), 150);

  if (!name || !role) {
    return fail("INVALID", "El nombre y el rol del colaborador son obligatorios");
  }

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
  return { ok: true as const };
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

/**
 * Todavía no hay pasarela de pago integrada, así que cambiar a PRO desde la
 * interfaz NO cobra nada. Para que cualquier usuario no pueda darse PRO gratis,
 * solo se permite si:
 *  - ALLOW_FREE_PRO_UPGRADE=true (modo demo, decisión consciente del propietario), o
 *  - el email del usuario coincide con ADMIN_EMAIL (cuenta del propietario).
 */
function canSelfUpgrade(email: string | null): boolean {
  if (process.env.ALLOW_FREE_PRO_UPGRADE === "true") return true;
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return !!admin && !!email && email.toLowerCase() === admin;
}

export async function upgradeToPro() {
  const user = await getAuthenticatedUser();

  if (!canSelfUpgrade(user.email)) {
    return {
      ok: false as const,
      error:
        "El pago del Plan PRO todavía no está activado. Escríbenos a soporte para contratarlo y te lo activamos.",
    };
  }

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
  return { ok: true as const };
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
  return { ok: true as const };
}

// ================= AUTH =================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignora lo que exceda de 72 bytes

export async function registerUser(formData: FormData) {
  const name = readText(formData.get("name"), 100);
  const email = readText(formData.get("email"), 150).toLowerCase();
  const passwordRaw = formData.get("password");
  const password = typeof passwordRaw === "string" ? passwordRaw : "";
  const role = readChoice(formData.get("role"), REGISTER_ROLES, "Jefe de Obra");
  const cif = readText(formData.get("cif"), 30).toUpperCase().replace(/[\s.-]/g, "");
  const companyName = readText(formData.get("companyName"), 150);

  if (!name || !email || !password || !cif) {
    return { success: false as const, error: "Nombre, email, contraseña y CIF/NIF de la empresa son obligatorios" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false as const, error: "El correo electrónico no es válido" };
  }

  if (!/^[A-Z0-9]{6,20}$/.test(cif)) {
    return { success: false as const, error: "El CIF/NIF no es válido: usa solo letras y números (6-20 caracteres)" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { success: false as const, error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { success: false as const, error: `La contraseña no puede superar los ${MAX_PASSWORD_LENGTH} caracteres` };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { success: false as const, error: "Este correo electrónico ya está registrado" };
  }

  // CERROJO 3: Control único por CIF/NIF para evitar multicuentas fraudulentas
  const existingCif = await prisma.user.findFirst({
    where: { cif },
  });

  if (existingCif) {
    return {
      success: false as const,
      error: `El CIF/NIF (${cif}) ya tiene una cuenta registrada en ObraClick. Para mantener el histórico y la trazabilidad de tus obras, inicia sesión con la cuenta de tu empresa o activa el Plan PRO.`,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // CERROJO 2: Período de prueba de 14 días
  const trialEndsAt = new Date(Date.now() + TRIAL_DURATION_MS);

  try {
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

    return { success: true as const, email: user.email };
  } catch (e) {
    // P2002 = violación de unicidad (registro simultáneo con el mismo email o CIF)
    if ((e as { code?: string })?.code === "P2002") {
      return { success: false as const, error: "Ya existe una cuenta con ese correo electrónico o CIF/NIF" };
    }
    console.error("Error creando usuario:", e);
    return { success: false as const, error: "No se pudo crear la cuenta. Inténtalo de nuevo en unos minutos." };
  }
}

export async function requestPasswordReset(formData: FormData) {
  const email = readText(formData.get("email"), 150).toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return { ok: false as const, error: "Introduce un correo electrónico válido" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });

    // Solo enviamos enlace si el usuario existe y tiene contraseña asignada (no cuentas OAuth exclusivas)
    if (user && user.password && user.email) {
      // Limpiar tokens anteriores para este email
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });

      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validez

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      const resetLink = `${getSiteUrl()}/recuperar-password?token=${token}`;
      await sendPasswordResetEmail(user.email, user.name || "Constructor", resetLink);
    }

    // Por seguridad, siempre devolvemos el mismo mensaje para evitar enumeración de cuentas
    return {
      ok: true as const,
      message: "Si este correo está registrado, recibirás un enlace de recuperación en los próximos minutos.",
    };
  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    return {
      ok: false as const,
      error: "No se pudo procesar la solicitud. Inténtalo de nuevo en unos minutos.",
    };
  }
}

export async function resetPasswordWithToken(formData: FormData) {
  const token = readText(formData.get("token"), 100);
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
  const confirmPassword = typeof formData.get("confirmPassword") === "string" ? (formData.get("confirmPassword") as string) : "";

  if (!token) {
    return { ok: false as const, error: "El token de recuperación es obligatorio" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false as const, error: `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { ok: false as const, error: `La contraseña no puede superar los ${MAX_PASSWORD_LENGTH} caracteres` };
  }

  if (password !== confirmPassword) {
    return { ok: false as const, error: "Las contraseñas no coinciden" };
  }

  try {
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!tokenRecord || new Date() > new Date(tokenRecord.expires)) {
      return {
        ok: false as const,
        error: "El enlace de recuperación ha caducado o no es válido. Por favor, solicita uno nuevo.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: tokenRecord.identifier },
      data: { password: hashedPassword },
    });

    // Eliminar el token usado
    await prisma.verificationToken.delete({
      where: { token },
    });

    return { ok: true as const };
  } catch (error) {
    console.error("Error en resetPasswordWithToken:", error);
    return {
      ok: false as const,
      error: "Error al actualizar la contraseña. Por favor, solicita un nuevo enlace.",
    };
  }
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
      companyName: true,
      cif: true,
      createdAt: true,
      trialEndsAt: true,
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
