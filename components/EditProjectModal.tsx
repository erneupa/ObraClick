"use client";

import { useState } from "react";
import { updateProject } from "@/lib/actions";
import UpgradeModal from "./UpgradeModal";

interface EditProjectModalProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    location?: string | null;
    clientName?: string | null;
    budget: number;
    status: string;
    endDate?: Date | string | null;
  };
}

const STATUS_OPTIONS = [
  { value: "PLANIFICACION", label: "📋 Planificación" },
  { value: "EN_EJECUCION", label: "⚙️ En Ejecución" },
  { value: "PARALIZADA", label: "⏸️ Paralizada" },
  { value: "FINALIZADA", label: "✅ Finalizada" },
];

export default function EditProjectModal({ project }: EditProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);

  const endDateValue = project.endDate
    ? new Date(project.endDate).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", project.id);
    try {
      const result = await updateProject(formData);
      if (result.ok) {
        setIsOpen(false);
      } else if (result.code === "TRIAL_EXPIRED") {
        setIsOpen(false);
        setUpgradeReason("Tu período de prueba ha finalizado. Actualiza al Plan PRO para modificar los datos de tus obras.");
        setShowUpgradeModal(true);
      } else {
        alert(result.error);
      }
    } catch {
      alert("Error al actualizar la obra. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        style={{ padding: "8px 16px", fontSize: "13px", gap: "6px" }}
        title="Editar datos de la obra"
      >
        ✏️ Editar Obra
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          overflowY: "auto",
        }}>
          <div className="glass-panel slide-up" style={{
            maxWidth: "560px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "24px 20px",
            background: "#0f172a",
            position: "relative",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "22px" }}>✏️ Editar Obra</h2>
                <p className="text-secondary" style={{ margin: 0, fontSize: "14px" }}>
                  Modifica los datos del proyecto
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ color: "var(--text-secondary)", fontSize: "24px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                  Nombre de la Obra *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={project.name}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "15px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                  Descripción
                </label>
                <textarea
                  name="description"
                  defaultValue={project.description || ""}
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                    📍 Localización
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={project.location || ""}
                    placeholder="Calle, ciudad..."
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                    👤 Cliente / Promotor
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    defaultValue={project.clientName || ""}
                    placeholder="Nombre del cliente"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                    💰 Presupuesto (€)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    defaultValue={project.budget}
                    min="0"
                    step="100"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                    📅 Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={endDateValue}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none", colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
                  🔄 Estado de la Obra
                </label>
                <select
                  name="status"
                  defaultValue={project.status}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: "14px", outline: "none" }}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px", paddingTop: "16px", borderTop: "1px solid var(--surface-border)" }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                  style={{ padding: "10px 20px", fontSize: "14px" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ padding: "10px 24px", fontSize: "14px" }}
                >
                  {loading ? "Guardando..." : "💾 Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason={upgradeReason}
        />
      )}
    </>
  );
}
