import { prisma } from "./lib/prisma";

async function main() {
  const targetEmail = process.env.ADMIN_EMAIL || process.env.SEED_EMAIL;
  const user = targetEmail 
    ? await prisma.user.findFirst({ where: { email: targetEmail } })
    : await prisma.user.findFirst();

  if (!user) {
    console.log("No user found to seed. Create an account first or set ADMIN_EMAIL.");
    return;
  }

  const existingProjects = await prisma.project.count({
    where: { userId: user.id },
  });

  if (existingProjects > 0) {
    console.log("User already has projects. Skipping seed.");
    return;
  }

  console.log("Seeding initial showcase project for user:", user.email);

  const project = await prisma.project.create({
    data: {
      name: "Residencial Mirador del Parque - Bloque A",
      description: "Edificio residencial plurifamiliar de 16 viviendas, garajes y zonas comunes con calificación energética A.",
      location: "Av. de las Palmeras 18, Valencia",
      clientName: "Promociones Levante S.L.",
      budget: 485000,
      spent: 164200,
      progress: 50,
      status: "EN_EJECUCION",
      userId: user.id,
      milestones: {
        create: [
          { title: "Proyecto de Ejecución y Licencias", order: 1, completed: true, completedAt: new Date() },
          { title: "Movimiento de Tierras y Cimentación", order: 2, completed: true, completedAt: new Date() },
          { title: "Estructura de Hormigón Planta 1 a 4", order: 3, completed: true, completedAt: new Date() },
          { title: "Cerramientos de Fachada y Aislamiento", order: 4, completed: false },
          { title: "Instalaciones Eléctricas y Climatización", order: 5, completed: false },
          { title: "Carpinterías, Acabados y Certificado Final", order: 6, completed: false },
        ],
      },
      dailyReports: {
        create: [
          {
            title: "Hormigonado de forjado planta 3 y desencofrado",
            notes: "Vertido de 85 m³ de hormigón HA-30. Temperatura ambiente 21°C. Control de curado con agua iniciado. Subcontrata de ferralla revisada por dirección facultativa sin no conformidades.",
            weather: "Soleado",
            workersCount: 18,
          },
          {
            title: "Recepción de material de fontanería y replanteo de bajantes",
            notes: "Llegada de tuberías insonorizadas y colectores. Se inicia replanteo en sótano 1. Coordinado con cuadrilla de albañilería para apertura de patinillos.",
            weather: "Nublado",
            workersCount: 14,
          },
        ],
      },
      incidents: {
        create: [
          {
            title: "Demora de 3 días en entrega de perfilería de aluminio",
            description: "El proveedor informa de retraso logístico en taller. Se reajusta la cuadrilla para adelantar tabiquería seca de pladur sin afectar la fecha de entrega.",
            priority: "MEDIA",
            status: "ABIERTA",
            assignedTo: "Jefe de Obra (Carlos Navarro)",
          },
        ],
      },
      expenses: {
        create: [
          {
            concept: "Suministro de Hormigón HA-30 (Planta 3)",
            category: "MATERIALES",
            amount: 14650,
            supplier: "Hormigones del Turia S.A.",
            invoiceNumber: "F-2026-904",
            status: "PAGADO",
          },
          {
            concept: "Certificación mensual cuadrilla de encofrado",
            category: "MANO_DE_OBRA",
            amount: 22400,
            supplier: "Estructuras Levante S.L.",
            invoiceNumber: "CERT-03",
            status: "PAGADO",
          },
          {
            concept: "Alquiler mensual Grúa Torre 45m y generador",
            category: "MAQUINARIA",
            amount: 3850,
            supplier: "Maquinaria Pesada Ibérica",
            invoiceNumber: "MQ-8821",
            status: "PAGADO",
          },
          {
            concept: "Aislamiento lana de roca y láminas acústicas",
            category: "MATERIALES",
            amount: 8900,
            supplier: "Aislamientos Técnicos",
            invoiceNumber: "AT-311",
            status: "PAGADO",
          },
        ],
      },
    },
  });

  // Seed team members
  await prisma.teamMember.createMany({
    data: [
      {
        userId: user.id,
        name: "Carlos Navarro",
        role: "Jefe de Obra",
        company: "Constructora Principal",
        phone: "+34 612 345 678",
        email: "carlos.navarro@constructora.com",
        status: "ACTIVO",
      },
      {
        userId: user.id,
        name: "Lucía Méndez",
        role: "Arquitecta Directora",
        company: "Méndez & Asociados Arquitectura",
        phone: "+34 654 987 321",
        email: "lucia@mendezarq.es",
        status: "ACTIVO",
      },
      {
        userId: user.id,
        name: "Marcos Varela",
        role: "Maestro de Albañilería",
        company: "Cuadrillas Varela",
        phone: "+34 699 112 233",
        status: "ACTIVO",
      },
    ],
  });

  console.log("Seed completed successfully! Project ID:", project.id);
}

main().catch(console.error);
