import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ProjectPDFData {
  id: string;
  name: string;
  location?: string | null;
  clientName?: string | null;
  budget: number;
  spent: number;
  progress: number;
  status: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  milestones?: Array<{
    id: string;
    title: string;
    completed: boolean;
    description?: string | null;
  }>;
  expenses?: Array<{
    id: string;
    concept: string;
    category: string;
    supplier?: string | null;
    amount: number;
    status: string;
  }>;
  incidents?: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
  }>;
  dailyReports?: Array<{
    id: string;
    title: string;
    createdAt: string | Date;
    weather?: string | null;
    workersCount: number;
    notes: string;
  }>;
}

export function exportProjectCertificationPDF(project: ProjectPDFData, isPro: boolean = false) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ================= 1. HEADER & BRANDING =================
  // Top Banner
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, pageWidth, 35, "F");

  // Accent Line
  doc.setFillColor(59, 130, 246); // Primary blue
  doc.rect(0, 35, pageWidth, 2.5, "F");

  // Logo / Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CertiObra", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Plataforma de Control & Certificación de Obras", 15, 26);

  // Document Type Header (Right aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(isPro ? "INFORME OFICIAL DE CERTIFICACIÓN" : "COPIA DE PRUEBA (VERSIÓN FREE)", pageWidth - 15, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Fecha de emisión: ${today}`, pageWidth - 15, 25, { align: "right" });
  doc.text(`Expediente Ref: #${project.id.slice(-8).toUpperCase()}`, pageWidth - 15, 30, { align: "right" });

  // ================= 2. PROJECT OVERVIEW CARD =================
  let currentY = 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(project.name, 15, currentY);

  currentY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const locationText = project.location ? `Ubicación: ${project.location}` : "Ubicación: No especificada";
  const clientText = project.clientName ? ` · Promotor / Cliente: ${project.clientName}` : "";
  doc.text(`${locationText}${clientText}`, 15, currentY);

  currentY += 10;

  // Key Financial & Physical Metrics Table
  const remaining = Math.max(0, project.budget - project.spent);
  const statusLabels: Record<string, string> = {
    EN_EJECUCION: "EN EJECUCIÓN",
    PLANIFICACION: "PLANIFICACIÓN",
    PARALIZADA: "PARALIZADA",
    FINALIZADA: "FINALIZADA",
  };

  autoTable(doc, {
    startY: currentY,
    head: [["Estado Técnico", "Avance Global", "Presupuesto Previsto", "Gasto Certificado", "Saldo Disponible"]],
    body: [
      [
        statusLabels[project.status] || project.status,
        `${project.progress}%`,
        `${project.budget.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
        `${project.spent.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
        `${remaining.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [15, 23, 42],
      halign: "center",
      fontStyle: "bold",
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ================= 3. HITOS CONSTRUCTIVOS / CAPÍTULOS =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. ESTADO DE CAPÍTULOS E HITOS DE OBRA", 15, currentY);
  currentY += 4;

  const milestonesData = (project.milestones || []).map((m, index) => [
    `${index + 1}. ${m.title}`,
    m.completed ? "CERTIFICADO ✓" : "EN EJECUCIÓN / PENDIENTE",
    m.description || "-",
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Hito / Unidad de Obra", "Estado de Certificación", "Observaciones Técnicas"]],
    body: milestonesData.length > 0 ? milestonesData : [["Sin hitos registrados", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: "bold" },
      1: { cellWidth: 45, halign: "center" },
      2: { cellWidth: 55 },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ================= 4. GASTOS Y PARTIDAS ECONÓMICAS =================
  if (currentY > pageHeight - 60) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. RESUMEN DE GASTOS Y COMPRAS IMPUTADAS", 15, currentY);
  currentY += 4;

  const expensesData = (project.expenses || []).slice(0, 15).map((e) => [
    e.concept,
    e.category,
    e.supplier || "-",
    e.status,
    `${e.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Concepto / Partida", "Categoría", "Proveedor / Subcontrata", "Estado", "Importe"]],
    body: expensesData.length > 0 ? expensesData : [["Sin gastos imputados", "-", "-", "-", "0,00 €"]],
    theme: "striped",
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      4: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 16;

  // ================= 5. FIRMAS Y VALIDEZ =================
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "El presente documento certifica los avances físicos y financieros registrados digitalmente a pie de obra mediante CertiObra.",
    15,
    currentY
  );
  currentY += 15;

  // Signatures boxes
  const boxWidth = 80;
  // Box 1: Dirección Facultativa
  doc.setDrawColor(203, 213, 225);
  doc.line(20, currentY, 20 + boxWidth, currentY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("Firma: Dirección Facultativa / Arquitecto", 20, currentY + 5);

  // Box 2: Jefe de Obra / Constructora
  doc.line(pageWidth - 20 - boxWidth, currentY, pageWidth - 20, currentY);
  doc.text("Firma: Jefe de Obra / Constructora", pageWidth - 20 - boxWidth, currentY + 5);

  // Footer & Watermark on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // CERROJO 1: MARCA DE AGUA DISUASORIA EN PLAN GRATUITO
    if (!isPro) {
      // Top warning banner
      doc.setFillColor(254, 242, 242);
      doc.rect(0, 0, pageWidth, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(220, 38, 38);
      doc.text(
        "⚠️ COPIA DE PRUEBA NO CERTIFICADA · CONTRATE EL PLAN PRO EN CERTIOBRA.COM PARA VALIDEZ LEGAL Y SIN MARCAS",
        pageWidth / 2,
        4.2,
        { align: "center" }
      );

      // Large diagonal watermark
      doc.saveGraphicsState();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(239, 68, 68);
      doc.text("VERSIÓN DE PRUEBA GRATUITA", pageWidth / 2, pageHeight / 2 - 15, {
        align: "center",
        angle: 45,
      });
      doc.setFontSize(13);
      doc.setTextColor(160, 160, 160);
      doc.text("NO VÁLIDO PARA CERTIFICACIÓN OFICIAL NI BANCARIA", pageWidth / 2, pageHeight / 2 + 5, {
        align: "center",
        angle: 45,
      });
      doc.text("CERTIOBRA.COM — CONTRATE PLAN PRO PARA RETIRAR MARCA", pageWidth / 2, pageHeight / 2 + 20, {
        align: "center",
        angle: 45,
      });
      doc.restoreGraphicsState();
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CertiObra · Certificación de Obra · Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  // Trigger Save
  const cleanName = project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`Certificacion_Obra_${cleanName}.pdf`);
}

export function exportProjectFullReportPDF(project: ProjectPDFData, isPro: boolean = false) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ================= 1. HEADER & BRANDING =================
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFillColor(59, 130, 246); // Primary blue stripe
  doc.rect(0, 36, pageWidth, 2.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CertiObra", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Plataforma de Control & Gestión Integral de Obras", 15, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isPro ? "INFORME TÉCNICO Y EJECUTIVO DE OBRA" : "INFORME DE OBRA (VERSIÓN FREE)",
    pageWidth - 15,
    18,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Fecha de emisión: ${today}`, pageWidth - 15, 25, { align: "right" });
  doc.text(`Expediente Ref: #${project.id.slice(-8).toUpperCase()}`, pageWidth - 15, 30, { align: "right" });

  let currentY = 48;

  // ================= 2. PROJECT OVERVIEW CARD =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(project.name, 15, currentY);

  currentY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const locationText = project.location ? `Ubicación: ${project.location}` : "Ubicación: Sin especificar";
  const clientText = project.clientName ? ` · Promotor: ${project.clientName}` : "";
  doc.text(`${locationText}${clientText}`, 15, currentY);

  currentY += 9;

  // Key Metrics Table
  const remaining = Math.max(0, project.budget - project.spent);
  const completedMilestones = (project.milestones || []).filter((m) => m.completed).length;
  const totalMilestones = (project.milestones || []).length;
  const openIncidents = (project.incidents || []).filter((i) => i.status !== "RESUELTA").length;

  const statusLabels: Record<string, string> = {
    EN_EJECUCION: "EN EJECUCIÓN",
    PLANIFICACION: "PLANIFICACIÓN",
    PARALIZADA: "PARALIZADA",
    FINALIZADA: "FINALIZADA",
  };

  autoTable(doc, {
    startY: currentY,
    head: [["Estado", "Avance Global", "Presupuesto", "Gasto Imputado", "Saldo Restante", "Hitos Aprobados", "Incidencias Activas"]],
    body: [
      [
        statusLabels[project.status] || project.status,
        `${project.progress}%`,
        `${project.budget.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
        `${project.spent.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
        `${remaining.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
        `${completedMilestones} / ${totalMilestones}`,
        `${openIncidents}`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [15, 23, 42],
      halign: "center",
      fontStyle: "bold",
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ================= 3. HITOS CONSTRUCTIVOS / CRONOGRAMA =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. FASES CONSTRUCTIVAS E HITOS DE CONTROL", 15, currentY);
  currentY += 4;

  const milestonesData = (project.milestones || []).map((m, index) => [
    `${index + 1}. ${m.title}`,
    m.completed ? "COMPLETADO ✓" : "EN CURSO / PENDIENTE",
    m.description || "Sin observaciones adicionales",
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Capítulo / Hito", "Estado", "Observaciones"]],
    body: milestonesData.length > 0 ? milestonesData : [["Sin hitos registrados", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: "bold" },
      1: { cellWidth: 45, halign: "center" },
      2: { cellWidth: 65 },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ================= 4. LIBRO DE ÓRDENES / PARTES DIARIOS =================
  if (currentY > pageHeight - 60) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. LIBRO DE ÓRDENES Y PARTES DIARIOS DE OBRA", 15, currentY);
  currentY += 4;

  const reportsData = (project.dailyReports || []).map((r) => [
    new Date(r.createdAt).toLocaleDateString("es-ES"),
    r.title,
    r.weather || "Soleado",
    `${r.workersCount} pers.`,
    r.notes,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Fecha", "Resumen de Jornada", "Clima", "Personal", "Descripción de Trabajos"]],
    body: reportsData.length > 0 ? reportsData : [["-", "Sin partes diarios registrados", "-", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 22, halign: "center" },
      1: { cellWidth: 45, fontStyle: "bold" },
      2: { cellWidth: 22, halign: "center" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 71 },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ================= 5. INCIDENCIAS DE OBRA =================
  if (currentY > pageHeight - 60) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("3. REGISTRO DE INCIDENCIAS TÉCNICAS Y SEGURIDAD", 15, currentY);
  currentY += 4;

  const incidentsData = (project.incidents || []).map((inc) => [
    inc.title,
    inc.priority,
    inc.status === "RESUELTA" ? "RESUELTA ✓" : "ABIERTA / PENDIENTE",
    inc.assignedTo || "Sin asignar",
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Incidencia", "Prioridad", "Estado", "Responsable Asignado"]],
    body: incidentsData.length > 0 ? incidentsData : [["Sin incidencias registradas en este período", "-", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: [239, 68, 68],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: "bold" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 40, halign: "center" },
      3: { cellWidth: 30 },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // ================= 6. RESUMEN DE GASTOS Y COMPRAS =================
  if (currentY > pageHeight - 60) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("4. DESGLOSE ECONÓMICO Y GASTOS IMPUTADOS", 15, currentY);
  currentY += 4;

  const expensesData = (project.expenses || []).map((e) => [
    e.concept,
    e.category,
    e.supplier || "-",
    e.status,
    `${e.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Partida / Concepto", "Categoría", "Proveedor / Subcontrata", "Estado", "Importe"]],
    body: expensesData.length > 0 ? expensesData : [["Sin gastos imputados", "-", "-", "-", "0,00 €"]],
    theme: "striped",
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      4: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 16;

  // ================= 7. DILIGENCIA Y FIRMAS =================
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Diligencia de conformidad: El presente informe refleja fielmente el estado técnico, documental y económico de la obra en la fecha indicada.",
    15,
    currentY
  );
  currentY += 15;

  const colWidth = (pageWidth - 30) / 3;
  // Box 1: Dirección Facultativa
  doc.setDrawColor(203, 213, 225);
  doc.line(15, currentY, 15 + colWidth - 10, currentY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Dirección Facultativa", 15, currentY + 5);

  // Box 2: Jefe de Obra
  doc.line(15 + colWidth, currentY, 15 + 2 * colWidth - 10, currentY);
  doc.text("Jefe de Obra / Constructora", 15 + colWidth, currentY + 5);

  // Box 3: Promotor / Propiedad
  doc.line(15 + 2 * colWidth, currentY, pageWidth - 15, currentY);
  doc.text("Promotor / Propiedad", 15 + 2 * colWidth, currentY + 5);

  // Watermark & Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    if (!isPro) {
      doc.setFillColor(254, 242, 242);
      doc.rect(0, 0, pageWidth, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(220, 38, 38);
      doc.text(
        "⚠️ COPIA DE PRUEBA NO CERTIFICADA · CONTRATE EL PLAN PRO EN CERTIOBRA.COM PARA VALIDEZ LEGAL Y SIN MARCAS",
        pageWidth / 2,
        4.2,
        { align: "center" }
      );

      doc.saveGraphicsState();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(239, 68, 68);
      doc.text("VERSIÓN DE PRUEBA GRATUITA", pageWidth / 2, pageHeight / 2 - 15, {
        align: "center",
        angle: 45,
      });
      doc.setFontSize(13);
      doc.setTextColor(160, 160, 160);
      doc.text("NO VÁLIDO PARA PRESENTACIÓN OFICIAL NI BANCARIA", pageWidth / 2, pageHeight / 2 + 5, {
        align: "center",
        angle: 45,
      });
      doc.text("CERTIOBRA.COM — ACTUALICE A PRO PARA RETIRAR MARCA", pageWidth / 2, pageHeight / 2 + 20, {
        align: "center",
        angle: 45,
      });
      doc.restoreGraphicsState();
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CertiObra · Informe Completo de Obra · Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  const cleanReportName = project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`Informe_Completo_${cleanReportName}.pdf`);
}

export interface SingleDailyReportPDFData {
  projectName: string;
  projectLocation?: string | null;
  clientName?: string | null;
  report: {
    id: string;
    title: string;
    notes: string;
    weather?: string | null;
    workersCount: number;
    imageUrl?: string | null;
    signatureUrl?: string | null;
    createdAt: string | Date;
  };
}

export function exportSingleDailyReportPDF(data: SingleDailyReportPDFData, isPro: boolean = false) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const reportDate = new Date(data.report.createdAt).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Top Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFillColor(16, 185, 129); // Emerald accent for daily reports
  doc.rect(0, 36, pageWidth, 2.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CertiObra", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Libro de Órdenes & Partes Diarios de Obra", 15, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isPro ? "ACTA DIARIA OFICIAL DE OBRA" : "PARTE DIARIO (COPIA DE PRUEBA)",
    pageWidth - 15,
    18,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Ref. Parte: #${data.report.id.slice(-8).toUpperCase()}`, pageWidth - 15, 26, { align: "right" });

  let currentY = 48;

  // Project Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`Obra: ${data.projectName}`, 15, currentY);

  currentY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const loc = data.projectLocation ? `Ubicación: ${data.projectLocation}` : "Ubicación: No especificada";
  const cli = data.clientName ? ` · Promotor: ${data.clientName}` : "";
  doc.text(`${loc}${cli}`, 15, currentY);

  currentY += 10;

  // Technical Metrics Box
  autoTable(doc, {
    startY: currentY,
    head: [["Fecha de Jornada", "Clima / Condiciones", "Operarios Activos", "Título del Parte"]],
    body: [
      [
        reportDate,
        data.report.weather || "Normal / Soleado",
        `${data.report.workersCount} operarios`,
        data.report.title,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [15, 23, 42],
      halign: "center",
      fontStyle: "bold",
    },
    margin: { left: 15, right: 15 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Work notes description
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("REGISTRO DE TRABAJOS Y OBSERVACIONES TÉCNICAS", 15, currentY);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const splitNotes = doc.splitTextToSize(data.report.notes, pageWidth - 30);
  doc.text(splitNotes, 15, currentY);
  currentY += splitNotes.length * 5 + 10;

  // Photo section if present
  if (data.report.imageUrl) {
    if (currentY > pageHeight - 90) {
      doc.addPage();
      currentY = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("FOTOGRAFÍA ADJUNTA A PIE DE OBRA", 15, currentY);
    currentY += 6;

    try {
      doc.addImage(data.report.imageUrl, "JPEG", 15, currentY, 90, 60);
      currentY += 66;
    } catch {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("(Fotografía adjunta en formato digital en plataforma)", 15, currentY);
      currentY += 8;
    }
  }

  // Signature section
  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 25;
  }

  currentY += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("VALIDACIÓN Y FIRMA DIGITAL DE CONFORMIDAD", 15, currentY);
  currentY += 8;

  const boxW = 85;
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, currentY, boxW, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Firma del Encargado / Jefe de Obra:", 18, currentY + 6);

  if (data.report.signatureUrl) {
    try {
      doc.addImage(data.report.signatureUrl, "PNG", 20, currentY + 8, 60, 24);
    } catch {}
  }

  // Secondary signature box: Dirección Facultativa
  doc.rect(pageWidth - 15 - boxW, currentY, boxW, 38);
  doc.text("Vº Bº Dirección Facultativa / Propiedad:", pageWidth - 15 - boxW + 3, currentY + 6);

  // Watermark if !isPro
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    if (!isPro) {
      doc.setFillColor(254, 242, 242);
      doc.rect(0, 0, pageWidth, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(220, 38, 38);
      doc.text(
        "⚠️ COPIA DE PRUEBA · CONTRATE EL PLAN PRO EN CERTIOBRA.COM PARA VALIDEZ LEGAL Y SIN MARCAS",
        pageWidth / 2,
        4.2,
        { align: "center" }
      );

      doc.saveGraphicsState();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(239, 68, 68);
      doc.text("PARTE DE PRUEBA GRATUITO", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      });
      doc.restoreGraphicsState();
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CertiObra · Parte Diario · ${data.projectName} · Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  const cleanName = data.projectName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const cleanDate = new Date(data.report.createdAt).toISOString().slice(0, 10);
  doc.save(`Parte_Diario_${cleanDate}_${cleanName}.pdf`);
}


