"use client";

import { useState } from "react";
import { 
  toggleMilestone, 
  addMilestone, 
  updateMilestone,
  deleteMilestone,
  addDailyReport, 
  updateDailyReport,
  deleteDailyReport,
  addIncident, 
  updateIncident,
  deleteIncident,
  resolveIncident, 
  addExpense, 
  updateExpense,
  deleteExpense,
  updateProjectStatus,
  generateClientToken,
  revokeClientToken 
} from "@/lib/actions";
import { 
  exportProjectCertificationPDF, 
  exportProjectFullReportPDF, 
  exportSingleDailyReportPDF 
} from "@/lib/generatePdf";
import UpgradeModal from "@/components/UpgradeModal";
import EditProjectModal from "@/components/EditProjectModal";
import SignaturePad from "@/components/SignaturePad";
import { toast } from "@/components/ToastProvider";

function compressImage(file: File, maxDimension = 1280, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ProjectDetailsClientProps {
  project: any;
  userPlan?: string;
  trialEndsAt?: string | null;
}

export default function ProjectDetailsClient({ 
  project, 
  userPlan = "FREE", 
  trialEndsAt = null 
}: ProjectDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<"hitos" | "diario" | "incidencias" | "gastos">("hitos");
  const [milestoneViewMode, setMilestoneViewMode] = useState<"list" | "gantt">("list");
  const [loading, setLoading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingFullReport, setExportingFullReport] = useState(false);
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [reportSignature, setReportSignature] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);

  // Edit states for modals
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [editingDailyReport, setEditingDailyReport] = useState<any | null>(null);
  const [editReportImage, setEditReportImage] = useState<string | null | undefined>(undefined);
  const [editReportSignature, setEditReportSignature] = useState<string | null | undefined>(undefined);
  const [showEditSignaturePad, setShowEditSignaturePad] = useState(false);
  const [editingIncident, setEditingIncident] = useState<any | null>(null);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(project.clientToken || null);
  const [sharingLoading, setSharingLoading] = useState(false);

  const isPro = userPlan === "PRO" || userPlan === "ENTERPRISE";
  const isTrialExpired = !isPro && trialEndsAt ? new Date() > new Date(trialEndsAt) : false;
  const trialDaysRemaining = !isPro && trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
    : 0;

  // Milestone toggle handler
  async function handleToggleMilestone(milestoneId: string) {
    try {
      await toggleMilestone(milestoneId, project.id);
      toast("Hito constructivo actualizado", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para seguir actualizando hitos y avances.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error actualizando hito", "error");
    }
  }

  // Handle adding milestone
  async function handleAddMilestone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      await addMilestone(formData);
      (e.target as HTMLFormElement).reset();
      toast("Nuevo hito constructivo añadido", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para añadir nuevos hitos y fases de obra.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al añadir hito", "error");
    } finally {
      setLoading(false);
    }
  }

  // Handle adding daily report
  async function handleAddDailyReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    if (reportImage) {
      formData.set("imageUrl", reportImage);
    }
    if (reportSignature) {
      formData.set("signatureUrl", reportSignature);
    }
    try {
      await addDailyReport(formData);
      (e.target as HTMLFormElement).reset();
      setReportImage(null);
      setReportSignature(null);
      toast("Parte diario registrado y certificado", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para seguir registrando partes diarios con fotos y firmas.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al añadir parte diario", "error");
    } finally {
      setLoading(false);
    }
  }

  // Handle adding incident
  async function handleAddIncident(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      await addIncident(formData);
      (e.target as HTMLFormElement).reset();
      toast("Incidencia registrada correctamente", "info");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para registrar y resolver incidencias.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al registrar incidencia", "error");
    } finally {
      setLoading(false);
    }
  }

  // Handle resolving incident
  async function handleResolveIncident(incidentId: string) {
    try {
      await resolveIncident(incidentId, project.id);
      toast("Incidencia marcada como resuelta", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para gestionar incidencias.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al resolver incidencia", "error");
    }
  }

  // Handle adding expense
  async function handleAddExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      await addExpense(formData);
      (e.target as HTMLFormElement).reset();
      toast("Gasto registrado y balance actualizado", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para controlar partidas presupuestarias y gastos.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al registrar gasto", "error");
    } finally {
      setLoading(false);
    }
  }

  // Handle status change
  async function handleStatusChange(status: string) {
    try {
      await updateProjectStatus(project.id, status);
      toast("Estado de la obra actualizado", "success");
    } catch {
      toast("Error actualizando estado", "error");
    }
  }

  // ===== MILESTONES CRUD =====
  async function handleDeleteMilestone(id: string) {
    if (!confirm("¿Deseas eliminar este hito constructivo?")) return;
    try {
      await deleteMilestone(id, project.id);
      toast("Hito eliminado", "info");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar hitos.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al eliminar hito", "error");
    }
  }

  async function handleUpdateMilestone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      await updateMilestone(formData);
      setEditingMilestone(null);
      toast("Hito actualizado correctamente", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar hitos.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al actualizar hito", "error");
    } finally {
      setLoading(false);
    }
  }

  // ===== DAILY REPORTS CRUD =====
  async function handleDeleteDailyReport(id: string) {
    if (!confirm("¿Deseas eliminar este parte de obra?")) return;
    try {
      await deleteDailyReport(id, project.id);
      toast("Parte de obra eliminado", "info");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar partes diarios.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al eliminar parte de obra", "error");
    }
  }

  async function handleUpdateDailyReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    if (editReportImage !== undefined) {
      formData.set("imageUrl", editReportImage || "");
    }
    if (editReportSignature !== undefined) {
      formData.set("signatureUrl", editReportSignature || "");
    }
    try {
      await updateDailyReport(formData);
      setEditingDailyReport(null);
      setEditReportImage(undefined);
      setEditReportSignature(undefined);
      toast("Parte diario actualizado", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar partes diarios.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al actualizar parte diario", "error");
    } finally {
      setLoading(false);
    }
  }

  // ===== INCIDENTS CRUD =====
  async function handleDeleteIncident(id: string) {
    if (!confirm("¿Deseas eliminar esta incidencia?")) return;
    try {
      await deleteIncident(id, project.id);
      toast("Incidencia eliminada", "info");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar incidencias.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al eliminar incidencia", "error");
    }
  }

  async function handleUpdateIncident(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      await updateIncident(formData);
      setEditingIncident(null);
      toast("Incidencia actualizada", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar incidencias.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al actualizar incidencia", "error");
    } finally {
      setLoading(false);
    }
  }

  // ===== EXPENSES CRUD =====
  async function handleDeleteExpense(id: string) {
    if (!confirm("¿Deseas eliminar este gasto o partida presupuestaria?")) return;
    try {
      await deleteExpense(id, project.id);
      toast("Gasto eliminado", "info");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar gastos.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al eliminar gasto", "error");
    }
  }

  async function handleUpdateExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      await updateExpense(formData);
      setEditingExpense(null);
      toast("Gasto actualizado", "success");
    } catch (err: any) {
      if ((err?.message?.includes("TRIAL_EXPIRED") || isTrialExpired)) {
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para modificar gastos.");
        setShowUpgradeModal(true);
        return;
      }
      toast("Error al actualizar gasto", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* CERROJO 2: Banner de Período de Prueba Expirado o Restante */}
      {isTrialExpired && (
        <div style={{
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: "14px",
          padding: "18px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
          boxShadow: "0 8px 20px -6px rgba(239, 68, 68, 0.25)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "28px" }}>⏳</span>
            <div>
              <h4 style={{ margin: 0, color: "#f87171", fontSize: "16px", fontWeight: "700" }}>
                Período de prueba de 14 días concluido
              </h4>
              <p style={{ margin: "4px 0 0 0", color: "#e2e8f0", fontSize: "13px" }}>
                Tu cuenta está en modo de solo lectura. Para seguir añadiendo partes diarios, gastos y generar certificaciones oficiales sin marca de agua, actualiza a ObraClick PRO.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setUpgradeReason("Tu período de prueba de 14 días ha concluido. Pasa a ObraClick PRO para gestionar todas tus obras sin límites y certificar proyectos oficiales.");
              setShowUpgradeModal(true);
            }}
            className="btn-primary"
            style={{
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
              whiteSpace: "nowrap"
            }}
          >
            Activar Plan PRO (79€/mes) →
          </button>
        </div>
      )}

      {!isPro && !isTrialExpired && trialEndsAt && (
        <div style={{
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "12px",
          padding: "10px 18px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          fontSize: "13px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#93c5fd" }}>
            <span>🕒</span>
            <span>Prueba gratuita de 14 días activa: <strong>{trialDaysRemaining} {trialDaysRemaining === 1 ? "día restante" : "días restantes"}</strong>.</span>
          </div>
          <button
            onClick={() => {
              setUpgradeReason("Pasa al Plan PRO para eliminar las marcas de agua de tus certificaciones y desbloquear obras ilimitadas.");
              setShowUpgradeModal(true);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#60a5fa",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "12px"
            }}
          >
            Pasar a PRO sin marcas de agua →
          </button>
        </div>
      )}

      {/* Top Project Status & Overview Bar */}
      <div className="glass-panel" style={{ padding: "28px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "28px", margin: 0, fontWeight: "800", color: "#fff" }}>
                {project.name}
              </h1>
              <select 
                defaultValue={project.status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  background: "rgba(0,0,0,0.4)",
                  color: project.status === "EN_EJECUCION" ? "#10b981" : "#60a5fa",
                  border: "1px solid var(--surface-border)",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="PLANIFICACION">Planificación</option>
                <option value="EN_EJECUCION">En Ejecución</option>
                <option value="PARALIZADA">Paralizada</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
              <EditProjectModal project={project} />
            </div>
            <p className="text-secondary" style={{ margin: 0, fontSize: "15px" }}>
              📍 {project.location || "Sin dirección"} {project.clientName ? `• Cliente: ${project.clientName}` : ""}
            </p>

            {/* Client Portal Share Link */}
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {clientToken ? (
                <>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    color: "#10b981"
                  }}>
                    <span>🔗</span>
                    <span>Portal del cliente activo</span>
                  </div>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/obra/${clientToken}`;
                      navigator.clipboard.writeText(url);
                      toast("¡Enlace del portal copiado al portapapeles!", "success");
                    }}
                    className="btn-secondary"
                    style={{ padding: "5px 12px", fontSize: "12px", gap: "4px" }}
                  >
                    📋 Copiar enlace
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("¿Revocar el acceso del cliente a este portal?")) return;
                      setSharingLoading(true);
                      try {
                        await revokeClientToken(project.id);
                        setClientToken(null);
                        toast("Acceso al portal revocado correctamente", "info");
                      } catch {
                        toast("Error al revocar acceso", "error");
                      } finally {
                        setSharingLoading(false);
                      }
                    }}
                    disabled={sharingLoading}
                    style={{ padding: "5px 12px", fontSize: "12px", color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Revocar acceso
                  </button>
                </>
              ) : (
                <button
                  onClick={async () => {
                    setSharingLoading(true);
                    try {
                      const token = await generateClientToken(project.id);
                      setClientToken(token);
                      const url = `${window.location.origin}/obra/${token}`;
                      navigator.clipboard.writeText(url);
                      toast("¡Portal del cliente creado! Enlace copiado al portapapeles.", "success");
                    } catch {
                      toast("Error al generar enlace", "error");
                    } finally {
                      setSharingLoading(false);
                    }
                  }}
                  disabled={sharingLoading}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "12px", gap: "6px" }}
                >
                  🔗 {sharingLoading ? "Generando..." : "Compartir con cliente"}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: "20px", textAlign: "right" }}>
              <div>
                <span className="text-secondary" style={{ fontSize: "12px", display: "block" }}>GASTO EJECUTADO</span>
                <strong style={{ fontSize: "20px", color: "#10b981" }}>
                  {project.spent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </strong>
              </div>
              <div style={{ borderLeft: "1px solid var(--surface-border)", paddingLeft: "20px" }}>
                <span className="text-secondary" style={{ fontSize: "12px", display: "block" }}>PRESUPUESTO TOTAL</span>
                <strong style={{ fontSize: "20px", color: "#fff" }}>
                  {project.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </strong>
              </div>
            </div>

            {/* Generación de Certificación e Informe Completo PDF */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setExportingPdf(true);
                    try {
                      exportProjectCertificationPDF(project, isPro);
                      toast("Certificación oficial descargada en PDF", "success");
                    } catch {
                      toast("Error al generar la certificación PDF", "error");
                    } finally {
                      setExportingPdf(false);
                    }
                  }}
                  disabled={exportingPdf}
                  className="btn-primary"
                  style={{
                    padding: "9px 14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    background: isPro 
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: isPro 
                      ? "0 4px 14px rgba(16, 185, 129, 0.35)" 
                      : "0 4px 14px rgba(59, 130, 246, 0.35)",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "9px"
                  }}
                >
                  <span>📜</span>
                  <span>{exportingPdf ? "Generando..." : isPro ? "Certificación Oficial" : "Certificación (PDF)"}</span>
                </button>

                <button
                  onClick={() => {
                    setExportingFullReport(true);
                    try {
                      exportProjectFullReportPDF(project, isPro);
                      toast("Informe técnico completo descargado en PDF", "success");
                    } catch {
                      toast("Error al generar el informe completo", "error");
                    } finally {
                      setExportingFullReport(false);
                    }
                  }}
                  disabled={exportingFullReport}
                  className="btn-primary"
                  style={{
                    padding: "9px 14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "9px"
                  }}
                >
                  <span>📊</span>
                  <span>{exportingFullReport ? "Generando..." : "Informe Completo (PDF)"}</span>
                </button>
              </div>

              {!isPro && (
                <span style={{ fontSize: "11px", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>
                  ⚠️ Copia de prueba con marca de agua (Pasa a PRO para descarga oficial y limpia)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
            <span className="text-secondary">Avance Global de la Obra</span>
            <strong style={{ color: "#fff" }}>{project.progress}% completado</strong>
          </div>
          <div style={{ width: "100%", height: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: `${project.progress}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: "999px" }} />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--surface-border)", marginBottom: "32px", overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: "4px" }}>
        <button
          onClick={() => setActiveTab("hitos")}
          style={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "600",
            color: activeTab === "hitos" ? "white" : "var(--text-secondary)",
            borderBottom: activeTab === "hitos" ? "2px solid var(--accent-primary)" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>🎯</span>
          <span>Hitos y Cronograma ({project.milestones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("diario")}
          style={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "600",
            color: activeTab === "diario" ? "white" : "var(--text-secondary)",
            borderBottom: activeTab === "diario" ? "2px solid var(--accent-primary)" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>📋</span>
          <span>Diario de Obra ({project.dailyReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("incidencias")}
          style={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "600",
            color: activeTab === "incidencias" ? "white" : "var(--text-secondary)",
            borderBottom: activeTab === "incidencias" ? "2px solid var(--accent-primary)" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>⚠️</span>
          <span>Incidencias ({project.incidents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("gastos")}
          style={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "600",
            color: activeTab === "gastos" ? "white" : "var(--text-secondary)",
            borderBottom: activeTab === "gastos" ? "2px solid var(--accent-primary)" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>💶</span>
          <span>Gastos y Partidas ({project.expenses.length})</span>
        </button>
      </div>

      {/* TAB 1: HITOS */}
      {activeTab === "hitos" && (
        <div className="dashboard-two-column-grid">
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ fontSize: "18px", margin: 0, fontWeight: "700" }}>Fases y Certificaciones Constructivas</h2>
              <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.06)", padding: "4px", borderRadius: "8px", border: "1px solid var(--surface-border)" }}>
                <button
                  type="button"
                  onClick={() => setMilestoneViewMode("list")}
                  style={{
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: milestoneViewMode === "list" ? "var(--accent-primary)" : "transparent",
                    color: milestoneViewMode === "list" ? "#fff" : "var(--text-secondary)"
                  }}
                >
                  📋 Lista
                </button>
                <button
                  type="button"
                  onClick={() => setMilestoneViewMode("gantt")}
                  style={{
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: milestoneViewMode === "gantt" ? "var(--accent-primary)" : "transparent",
                    color: milestoneViewMode === "gantt" ? "#fff" : "var(--text-secondary)"
                  }}
                >
                  📊 Diagrama Gantt
                </button>
              </div>
            </div>

            {project.milestones.length === 0 ? (
              <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No hay hitos en esta obra. Puedes crear las fases personalizadas en el formulario lateral.
              </div>
            ) : milestoneViewMode === "gantt" ? (
              /* GANTT TIMELINE CHART */
              <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <div style={{ minWidth: "560px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Gantt Header Timeline Scale */}
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", borderBottom: "1px solid var(--surface-border)", paddingBottom: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase" }}>Fase / Capítulo</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", fontSize: "11px", color: "var(--text-secondary)", fontWeight: "600" }}>
                    <span>Fase I · Inicio</span>
                    <span>Fase II · Estructura</span>
                    <span>Fase III · Instalaciones</span>
                    <span>Fase IV · Acabados</span>
                  </div>
                </div>

                {/* Gantt Rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {project.milestones.map((m: any, idx: number) => {
                    const totalM = project.milestones.length;
                    const spanWidth = Math.max(25, Math.min(100, Math.round(100 / Math.max(1, totalM - 0.5))));
                    const leftOffset = Math.round((idx / Math.max(1, totalM)) * 75);

                    return (
                      <div key={m.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                          <input 
                            type="checkbox" 
                            checked={m.completed}
                            onChange={() => handleToggleMilestone(m.id)}
                            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#10b981", flexShrink: 0 }}
                          />
                          <span style={{ 
                            fontSize: "13px", 
                            fontWeight: "600", 
                            color: m.completed ? "#94a3b8" : "#fff",
                            textDecoration: m.completed ? "line-through" : "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {idx + 1}. {m.title}
                          </span>
                        </div>

                        {/* Visual Timeline Bar */}
                        <div style={{ position: "relative", height: "28px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <div 
                            style={{
                              position: "absolute",
                              left: `${leftOffset}%`,
                              width: `${spanWidth}%`,
                              height: "100%",
                              borderRadius: "5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "700",
                              transition: "all 0.3s ease",
                              background: m.completed 
                                ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" 
                                : "linear-gradient(90deg, rgba(59, 130, 246, 0.6) 0%, rgba(99, 102, 241, 0.8) 100%)",
                              color: "#fff",
                              boxShadow: m.completed ? "0 2px 8px rgba(16, 185, 129, 0.4)" : "0 2px 8px rgba(59, 130, 246, 0.3)"
                            }}
                          >
                            {m.completed ? "✓ Certificado" : "En curso"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Gantt Summary Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--surface-border)", paddingTop: "12px", marginTop: "6px", flexWrap: "wrap", gap: "10px", fontSize: "12px" }}>
                  <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)" }}>
                    <span>Total fases: <strong style={{ color: "#fff" }}>{project.milestones.length}</strong></span>
                    <span>Completadas: <strong style={{ color: "#10b981" }}>{project.milestones.filter((m: any) => m.completed).length}</strong></span>
                    <span>Pendientes: <strong style={{ color: "#f59e0b" }}>{project.milestones.filter((m: any) => !m.completed).length}</strong></span>
                  </div>
                  <span style={{ color: "#60a5fa", fontWeight: "600" }}>
                    Cronograma sincronizado con el avance físico ({project.progress}%)
                  </span>
                </div>
                </div>
              </div>
            ) : (
              /* LIST VIEW */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {project.milestones.map((m: any) => (
                  <div 
                    key={m.id}
                    className="glass-panel"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      borderLeft: m.completed ? "4px solid #10b981" : "4px solid rgba(255,255,255,0.15)"
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={m.completed}
                      onChange={() => handleToggleMilestone(m.id)}
                      style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--accent-primary)" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: "15px", 
                        fontWeight: "600", 
                        color: m.completed ? "#94a3b8" : "#fff",
                        textDecoration: m.completed ? "line-through" : "none" 
                      }}>
                        {m.title}
                      </div>
                      {m.description && (
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {m.description}
                        </div>
                      )}
                    </div>
                    {m.completed && (
                      <span style={{ fontSize: "12px", color: "#10b981", background: "rgba(16, 185, 129, 0.15)", padding: "4px 8px", borderRadius: "6px" }}>
                        ✓ Certificado
                      </span>
                    )}
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        onClick={() => setEditingMilestone(m)}
                        title="Editar hito"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid var(--surface-border)",
                          color: "var(--text-secondary)",
                          borderRadius: "6px",
                          padding: "5px 8px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        title="Eliminar hito"
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          color: "#f87171",
                          borderRadius: "6px",
                          padding: "5px 8px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", margin: "0 0 16px 0", fontWeight: "700" }}>Añadir Nuevo Hito</h3>
              <form onSubmit={handleAddMilestone} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Título del Hito *</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Ej: Montaje de carpintería exterior"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Notas / Descripción</label>
                  <textarea 
                    name="description" 
                    rows={2}
                    placeholder="Detalles técnicos o fecha prevista..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "none" }}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px", fontSize: "14px", width: "100%" }}>
                  {loading ? "Guardando..." : "+ Agregar Hito"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIARIO DE OBRA */}
      {activeTab === "diario" && (
        <div className="dashboard-two-column-grid">
          <div>
            <h2 style={{ fontSize: "18px", margin: "0 0 16px 0", fontWeight: "700" }}>Bitácora de Partes Diarios</h2>
            {project.dailyReports.length === 0 ? (
              <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No hay partes diarios creados todavía. Utiliza el formulario lateral para registrar el parte de hoy.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {project.dailyReports.map((r: any) => (
                  <div key={r.id} className="glass-panel" style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>{r.title}</h4>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "var(--text-secondary)" }}>
                          <span>🌤️ {r.weather || "Normal"}</span>
                          <span>👷 {r.workersCount} operarios</span>
                          <span>📅 {new Date(r.createdAt).toLocaleDateString("es-ES")}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => {
                              try {
                                exportSingleDailyReportPDF({
                                  projectName: project.name,
                                  projectLocation: project.location,
                                  clientName: project.clientName,
                                  report: r,
                                }, isPro);
                                toast("Parte diario descargado en PDF", "success");
                              } catch {
                                toast("Error al generar el PDF del parte", "error");
                              }
                            }}
                            title="Descargar este parte en PDF"
                            style={{ 
                              background: "rgba(16, 185, 129, 0.12)", 
                              border: "1px solid rgba(16, 185, 129, 0.3)", 
                              color: "#10b981", 
                              borderRadius: "6px", 
                              padding: "4px 8px", 
                              fontSize: "12px", 
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <span>📄</span>
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingDailyReport(r);
                              setEditReportImage(r.imageUrl || null);
                              setEditReportSignature(r.signatureUrl || null);
                            }}
                            title="Editar parte"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--surface-border)", color: "var(--text-secondary)", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteDailyReport(r.id)}
                            title="Eliminar parte"
                            style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
                      {r.notes}
                    </p>
                    {r.imageUrl && (
                      <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <img 
                          src={r.imageUrl} 
                          alt={r.title} 
                          onClick={() => setPreviewModalImage(r.imageUrl)}
                          style={{ 
                            width: "140px", 
                            height: "90px", 
                            objectFit: "cover", 
                            borderRadius: "8px", 
                            border: "1px solid var(--surface-border)",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                          }} 
                        />
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          <strong style={{ color: "#fff", display: "block" }}>📷 Foto a pie de obra</strong>
                          <span>Haz clic para ver a tamaño completo</span>
                        </div>
                      </div>
                    )}
                    {r.signatureUrl && (
                      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(37, 99, 235, 0.08)", border: "1px solid rgba(37, 99, 235, 0.2)", borderRadius: "8px", padding: "6px 12px", width: "fit-content" }}>
                        <img src={r.signatureUrl} alt="Firma digital" style={{ height: "26px", objectFit: "contain", background: "#fff", borderRadius: "4px", padding: "2px 6px" }} />
                        <span style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "600" }}>✓ Firmado digitalmente a pie de obra</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", margin: "0 0 16px 0", fontWeight: "700" }}>Registrar Parte Diario</h3>
              <form onSubmit={handleAddDailyReport} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Resumen del Día *</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Ej: Hormigonado de pilares planta 2"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Clima</label>
                    <select 
                      name="weather" 
                      defaultValue="Soleado"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none" }}
                    >
                      <option value="Soleado">Soleado</option>
                      <option value="Nublado">Nublado</option>
                      <option value="Lluvia ligera">Lluvia ligera</option>
                      <option value="Temporal / Viento">Temporal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Operarios</label>
                    <input 
                      type="number" 
                      name="workersCount" 
                      defaultValue={12}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Bitácora de Trabajos y Observaciones *</label>
                  <textarea 
                    name="notes" 
                    required
                    rows={4}
                    placeholder="Detalles de avance, recepción de materiales, subcontratas presentes..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    📷 Fotografía de Obra (Opcional)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file);
                          setReportImage(compressed);
                        } catch {
                          const reader = new FileReader();
                          reader.onloadend = () => setReportImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                    style={{ 
                      width: "100%", 
                      fontSize: "12px", 
                      color: "var(--text-secondary)",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px dashed var(--surface-border)",
                      background: "rgba(255,255,255,0.03)"
                    }} 
                  />
                  {reportImage && (
                    <div style={{ marginTop: "8px", position: "relative", display: "inline-block" }}>
                      <img 
                        src={reportImage} 
                        alt="Previsualización" 
                        style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "6px", border: "2px solid var(--accent-primary)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setReportImage(null)}
                        style={{ position: "absolute", top: "-6px", right: "-6px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    ✍️ Validación con Firma Digital (Opcional)
                  </label>
                  {reportSignature ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)" }}>
                      <img src={reportSignature} alt="Firma" style={{ height: "36px", background: "#fff", borderRadius: "4px", padding: "2px 8px" }} />
                      <div style={{ flex: 1, fontSize: "12px", color: "#10b981", fontWeight: "600" }}>✓ Firma guardada</div>
                      <button type="button" onClick={() => setReportSignature(null)} style={{ color: "#f87171", fontSize: "12px", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Borrar</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSignaturePad(true)}
                      className="btn-secondary"
                      style={{ width: "100%", padding: "9px", fontSize: "13px", gap: "8px", justifyContent: "center" }}
                    >
                      <span>✍️</span>
                      <span>Firmar con el dedo o ratón</span>
                    </button>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px", fontSize: "14px", width: "100%" }}>
                  {loading ? "Guardando..." : "Guardar Parte de Obra"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INCIDENCIAS */}
      {activeTab === "incidencias" && (
        <div className="dashboard-two-column-grid">
          <div>
            <h2 style={{ fontSize: "18px", margin: "0 0 16px 0", fontWeight: "700" }}>Registro de Incidencias</h2>
            {project.incidents.length === 0 ? (
              <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "#10b981" }}>
                ✓ No hay incidencias registradas en esta obra. Todo el trabajo se encuentra conforme al plan.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {project.incidents.map((inc: any) => (
                  <div key={inc.id} className="glass-panel" style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <h4 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>{inc.title}</h4>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: inc.priority === "URGENTE" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                            color: inc.priority === "URGENTE" ? "#f87171" : "#fbbf24"
                          }}>
                            {inc.priority}
                          </span>
                        </div>
                        {inc.assignedTo && (
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            Asignado a: {inc.assignedTo}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {inc.status !== "RESUELTA" ? (
                          <button 
                            onClick={() => handleResolveIncident(inc.id)}
                            className="btn-secondary"
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                          >
                            Marcar Resuelta ✓
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>
                            ✓ Resuelta
                          </span>
                        )}
                        <button
                          onClick={() => setEditingIncident(inc)}
                          title="Editar incidencia"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--surface-border)", color: "var(--text-secondary)", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteIncident(inc.id)}
                          title="Eliminar incidencia"
                          style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                      {inc.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", margin: "0 0 16px 0", fontWeight: "700" }}>Reportar Incidencia</h3>
              <form onSubmit={handleAddIncident} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Título *</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Ej: Fisura en muro de contención"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Prioridad</label>
                    <select 
                      name="priority" 
                      defaultValue="MEDIA"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none" }}
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Asignado a</label>
                    <input 
                      type="text" 
                      name="assignedTo" 
                      placeholder="Jefe de Obra / Cuadrilla"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Descripción del Problema *</label>
                  <textarea 
                    name="description" 
                    required
                    rows={3}
                    placeholder="Causa observada, impacto en el cronograma, acción correctiva requerida..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "none" }}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px", fontSize: "14px", width: "100%" }}>
                  {loading ? "Registrando..." : "Registrar Incidencia"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GASTOS Y FINANZAS */}
      {activeTab === "gastos" && (
        <div className="dashboard-two-column-grid">
          <div>
            <h2 style={{ fontSize: "18px", margin: "0 0 16px 0", fontWeight: "700" }}>Partidas y Compras de la Obra</h2>
            {project.expenses.length === 0 ? (
              <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No hay compras o gastos imputados a esta obra aún.
              </div>
            ) : (
              <div className="glass-panel table-responsive" style={{ padding: "20px" }}>
                <table style={{ width: "100%", minWidth: "550px", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                      <th style={{ padding: "10px", color: "var(--text-secondary)" }}>Concepto</th>
                      <th style={{ padding: "10px", color: "var(--text-secondary)" }}>Categoría</th>
                      <th style={{ padding: "10px", color: "var(--text-secondary)" }}>Proveedor</th>
                      <th style={{ padding: "10px", color: "var(--text-secondary)" }}>Estado</th>
                      <th style={{ padding: "10px", color: "var(--text-secondary)", textAlign: "right" }}>Importe</th>
                      <th style={{ padding: "10px", color: "var(--text-secondary)", textAlign: "center" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.expenses.map((e: any) => (
                      <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "12px 10px", fontWeight: "600", color: "#fff" }}>{e.concept}</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-secondary)", fontSize: "13px" }}>{e.category}</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-secondary)", fontSize: "13px" }}>{e.supplier || "-"}</td>
                        <td style={{ padding: "12px 10px" }}>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                            {e.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "700", color: "#fff" }}>
                          {e.amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            <button
                              onClick={() => setEditingExpense(e)}
                              title="Editar gasto"
                              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--surface-border)", color: "var(--text-secondary)", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(e.id)}
                              title="Eliminar gasto"
                              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", margin: "0 0 16px 0", fontWeight: "700" }}>Registrar Gasto o Albarán</h3>
              <form onSubmit={handleAddExpense} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Concepto *</label>
                  <input 
                    type="text" 
                    name="concept" 
                    required 
                    placeholder="Ej: Suministro de hormigón HA-25"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Importe (€) *</label>
                    <input 
                      type="number" 
                      name="amount" 
                      required 
                      step="0.01" 
                      placeholder="1850"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Categoría</label>
                    <select 
                      name="category" 
                      defaultValue="MATERIALES"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none" }}
                    >
                      <option value="MATERIALES">Materiales</option>
                      <option value="MANO_DE_OBRA">Mano de Obra</option>
                      <option value="MAQUINARIA">Maquinaria</option>
                      <option value="SUBCONTRATAS">Subcontratas</option>
                      <option value="OTROS">Otros</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Proveedor o Subcontratista</label>
                  <input 
                    type="text" 
                    name="supplier" 
                    placeholder="Ej: Hormigones del Norte S.A."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px", fontSize: "14px", width: "100%" }}>
                  {loading ? "Añadiendo..." : "Imputar Gasto"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox Modal for Photos */}
      {previewModalImage && (
        <div 
          onClick={() => setPreviewModalImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModalImage(null)}
              style={{
                position: "absolute",
                top: "-36px",
                right: "0",
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "28px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
            <img 
              src={previewModalImage} 
              alt="Foto de obra ampliada" 
              style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.2)" }} 
            />
          </div>
        </div>
      )}

      {/* MODAL: EDITAR HITO */}
      {editingMilestone && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel slide-up" style={{ maxWidth: "480px", width: "100%", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>✏️ Editar Hito Constructivo</h3>
              <button onClick={() => setEditingMilestone(null)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleUpdateMilestone} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input type="hidden" name="id" value={editingMilestone.id} />
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Título del Hito *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={editingMilestone.title}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Descripción / Observaciones</label>
                <textarea 
                  name="description" 
                  rows={3}
                  defaultValue={editingMilestone.description || ""}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setEditingMilestone(null)} className="btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: "10px" }}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PARTE DIARIO */}
      {editingDailyReport && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel slide-up" style={{ maxWidth: "520px", width: "100%", padding: "28px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>✏️ Editar Parte Diario</h3>
              <button onClick={() => setEditingDailyReport(null)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleUpdateDailyReport} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input type="hidden" name="id" value={editingDailyReport.id} />
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Resumen del Día *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={editingDailyReport.title}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Clima</label>
                  <select 
                    name="weather" 
                    defaultValue={editingDailyReport.weather || "Soleado"}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.4)", color: "#fff", outline: "none" }}
                  >
                    <option value="Soleado">Soleado</option>
                    <option value="Nublado">Nublado</option>
                    <option value="Lluvia ligera">Lluvia ligera</option>
                    <option value="Temporal / Viento">Temporal</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Operarios</label>
                  <input 
                    type="number" 
                    name="workersCount" 
                    defaultValue={editingDailyReport.workersCount || 0}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Bitácora de Trabajos *</label>
                <textarea 
                  name="notes" 
                  required
                  rows={4}
                  defaultValue={editingDailyReport.notes}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Fotografía Adjunta</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file);
                        setEditReportImage(compressed);
                      } catch {
                        const reader = new FileReader();
                        reader.onloadend = () => setEditReportImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                  style={{ width: "100%", fontSize: "12px", color: "var(--text-secondary)", padding: "8px", borderRadius: "6px", border: "1px dashed var(--surface-border)", background: "rgba(255,255,255,0.03)" }} 
                />
                {(editReportImage !== undefined ? editReportImage : editingDailyReport.imageUrl) && (
                  <div style={{ marginTop: "8px", position: "relative", display: "inline-block" }}>
                    <img 
                      src={editReportImage !== undefined ? editReportImage! : editingDailyReport.imageUrl} 
                      alt="Vista previa" 
                      style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "6px", border: "2px solid var(--accent-primary)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditReportImage(null)}
                      style={{ position: "absolute", top: "-6px", right: "-6px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>✍️ Validación con Firma Digital</label>
                {(editReportSignature !== undefined ? editReportSignature : editingDailyReport.signatureUrl) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)" }}>
                    <img 
                      src={editReportSignature !== undefined ? editReportSignature! : editingDailyReport.signatureUrl} 
                      alt="Firma" 
                      style={{ height: "36px", background: "#fff", borderRadius: "4px", padding: "2px 8px" }} 
                    />
                    <div style={{ flex: 1, fontSize: "12px", color: "#10b981", fontWeight: "600" }}>✓ Firma registrada</div>
                    <button type="button" onClick={() => setEditReportSignature(null)} style={{ color: "#f87171", fontSize: "12px", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Eliminar firma</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowEditSignaturePad(true)}
                    className="btn-secondary"
                    style={{ width: "100%", padding: "9px", fontSize: "13px", gap: "8px", justifyContent: "center" }}
                  >
                    <span>✍️</span>
                    <span>Firmar con el dedo o ratón</span>
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setEditingDailyReport(null)} className="btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: "10px" }}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR INCIDENCIA */}
      {editingIncident && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel slide-up" style={{ maxWidth: "500px", width: "100%", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>✏️ Editar Incidencia</h3>
              <button onClick={() => setEditingIncident(null)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleUpdateIncident} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input type="hidden" name="id" value={editingIncident.id} />
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Título *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={editingIncident.title}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Prioridad</label>
                  <select 
                    name="priority" 
                    defaultValue={editingIncident.priority || "MEDIA"}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.4)", color: "#fff", outline: "none" }}
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Estado</label>
                  <select 
                    name="status" 
                    defaultValue={editingIncident.status || "ABIERTA"}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.4)", color: "#fff", outline: "none" }}
                  >
                    <option value="ABIERTA">Abierta</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="RESUELTA">Resuelta</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Asignado a</label>
                <input 
                  type="text" 
                  name="assignedTo" 
                  defaultValue={editingIncident.assignedTo || ""}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Descripción *</label>
                <textarea 
                  name="description" 
                  required
                  rows={3}
                  defaultValue={editingIncident.description}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setEditingIncident(null)} className="btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: "10px" }}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR GASTO */}
      {editingExpense && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel slide-up" style={{ maxWidth: "500px", width: "100%", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>✏️ Editar Gasto / Partida</h3>
              <button onClick={() => setEditingExpense(null)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleUpdateExpense} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input type="hidden" name="id" value={editingExpense.id} />
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Concepto *</label>
                <input 
                  type="text" 
                  name="concept" 
                  required 
                  defaultValue={editingExpense.concept}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Importe (€) *</label>
                  <input 
                    type="number" 
                    name="amount" 
                    required 
                    step="0.01"
                    defaultValue={editingExpense.amount}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Categoría</label>
                  <select 
                    name="category" 
                    defaultValue={editingExpense.category || "MATERIALES"}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.4)", color: "#fff", outline: "none" }}
                  >
                    <option value="MATERIALES">Materiales</option>
                    <option value="MANO_DE_OBRA">Mano de Obra</option>
                    <option value="MAQUINARIA">Maquinaria</option>
                    <option value="SUBCONTRATAS">Subcontratas</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Proveedor</label>
                  <input 
                    type="text" 
                    name="supplier" 
                    defaultValue={editingExpense.supplier || ""}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Estado</label>
                  <select 
                    name="status" 
                    defaultValue={editingExpense.status || "PAGADO"}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.4)", color: "#fff", outline: "none" }}
                  >
                    <option value="PAGADO">Pagado</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setEditingExpense(null)} className="btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: "10px" }}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Pad Modals */}
      {showSignaturePad && (
        <SignaturePad
          title="Firma del Parte Diario"
          onSave={(dataUrl) => {
            setReportSignature(dataUrl);
            setShowSignaturePad(false);
          }}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}

      {showEditSignaturePad && (
        <SignaturePad
          title="Modificar Firma del Parte Diario"
          onSave={(dataUrl) => {
            setEditReportSignature(dataUrl);
            setShowEditSignaturePad(false);
          }}
          onCancel={() => setShowEditSignaturePad(false)}
        />
      )}

      {/* Upgrade Modal for Expired Trial or Pro Limits */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason || "Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para continuar gestionando todas tus obras sin interrupciones."}
      />
    </div>
  );
}
