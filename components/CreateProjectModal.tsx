"use client";

import { useState } from "react";
import { createProject } from "@/lib/actions";
import UpgradeModal from "./UpgradeModal";

import { toast } from "./ToastProvider";

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createProject(formData);
      if (result.ok) {
        setIsOpen(false);
        toast("¡Obra creada con éxito!", "success");
      } else if (result.code === "TRIAL_EXPIRED") {
        setIsOpen(false);
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para crear nuevas obras y certificar proyectos.");
        setShowUpgradeModal(true);
      } else if (result.code === "PLAN_LIMIT_PROJECTS") {
        setIsOpen(false);
        setUpgradeReason("Has alcanzado el límite de 1 obra del Plan Gratuito. Pasa a ObraClick PRO para crear obras ilimitadas, descargar certificaciones y gestionar presupuestos sin barreras.");
        setShowUpgradeModal(true);
      } else {
        toast(result.error || "Datos no válidos", "error");
      }
    } catch {
      toast("Error al crear la obra. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        style={{ padding: "10px 20px", fontSize: "14px" }}
      >
        <span>+</span>
        <span>Nueva Obra</span>
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-panel slide-up" style={{
            maxWidth: "540px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "24px 20px",
            background: "#0f172a",
            position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "22px" }}>Crear Nueva Obra</h2>
                <p className="text-secondary" style={{ margin: 0, fontSize: "14px" }}>
                  Define los parámetros y el presupuesto de tu proyecto
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ color: "var(--text-secondary)", fontSize: "24px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                  Nombre del Proyecto *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Ej: Residencial Los Álamos - Bloque A"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                    Cliente o Promotora
                  </label>
                  <input 
                    type="text" 
                    name="clientName" 
                    placeholder="Ej: Grupo Promotor Sur"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--surface-border)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                    Presupuesto Previsto (€)
                  </label>
                  <input 
                    type="number" 
                    name="budget" 
                    placeholder="Ej: 350000"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--surface-border)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                  Ubicación / Dirección de Obra
                </label>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="Ej: Calle Gran Vía 54, Madrid"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                    Estado Inicial
                  </label>
                  <select 
                    name="status"
                    defaultValue="EN_EJECUCION"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--surface-border)",
                      background: "rgba(0,0,0,0.3)",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  >
                    <option value="PLANIFICACION">En Planificación</option>
                    <option value="EN_EJECUCION">En Ejecución Activa</option>
                    <option value="PARALIZADA">Paralizada temporalmente</option>
                    <option value="FINALIZADA">Finalizada / Entregada</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                    Fecha Estimada Entrega
                  </label>
                  <input 
                    type="date" 
                    name="endDate"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--surface-border)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                  Descripción / Observaciones
                </label>
                <textarea 
                  name="description" 
                  rows={3}
                  placeholder="Detalles técnicos, alcance, requisitos especiales..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--surface-border)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    resize: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                  style={{ padding: "10px 20px" }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  {loading ? "Creando..." : "Crear Proyecto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason || "Has alcanzado el límite de 1 obra del Plan Gratuito. Pasa a ObraClick PRO para crear obras ilimitadas, descargar certificaciones y gestionar presupuestos sin barreras."}
      />
    </>
  );
}
