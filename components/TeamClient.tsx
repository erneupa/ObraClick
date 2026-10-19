"use client";

import { useState } from "react";
import { addTeamMember, deleteTeamMember } from "@/lib/actions";
import UpgradeModal from "./UpgradeModal";

import { toast } from "./ToastProvider";

interface TeamClientProps {
  initialMembers: any[];
}

export default function TeamClient({ initialMembers }: TeamClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    try {
      const result = await addTeamMember(formData);
      if (result.ok) {
        setIsOpen(false);
        form.reset();
        toast("Colaborador añadido al equipo", "success");
      } else if (result.code === "TRIAL_EXPIRED") {
        setIsOpen(false);
        setUpgradeReason("Tu período de prueba de 14 días ha finalizado. Actualiza al Plan PRO para coordinar equipos y asignar cuadrillas.");
        setShowUpgradeModal(true);
      } else if (result.code === "PLAN_LIMIT_TEAM") {
        setIsOpen(false);
        setUpgradeReason("Has alcanzado el límite de 2 colaboradores del Plan Gratuito. Pasa a CertiObra PRO para añadir cuadrillas y subcontratistas ilimitados.");
        setShowUpgradeModal(true);
      } else {
        toast(result.error || "Datos no válidos", "error");
      }
    } catch {
      toast("Error al añadir miembro al equipo. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(memberId: string) {
    if (!confirm("¿Seguro que deseas eliminar a este colaborador?")) return;
    try {
      await deleteTeamMember(memberId);
      toast("Colaborador eliminado", "info");
    } catch {
      toast("Error al eliminar", "error");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Equipo y Cuadrillas de Obra
          </h1>
          <p className="text-secondary" style={{ margin: 0, fontSize: "15px" }}>
            Coordina a tus arquitectos, jefes de obra, cuadrillas y subcontratistas en un solo lugar.
          </p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{ padding: "10px 20px", fontSize: "14px" }}
        >
          <span>+</span>
          <span>Añadir Colaborador</span>
        </button>
      </div>

      {initialMembers.length === 0 ? (
        <div className="glass-panel" style={{ padding: "64px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>👥</div>
          <h2 style={{ fontSize: "22px", margin: "0 0 10px 0" }}>Aún no has registrado colaboradores</h2>
          <p className="text-secondary" style={{ maxWidth: "460px", margin: "0 auto 28px", fontSize: "15px" }}>
            Registra jefes de obra, oficiales, arquitectos o empresas subcontratadas para asignar tareas y controlar asistencia.
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="btn-primary"
            style={{ padding: "12px 24px", margin: "0 auto" }}
          >
            + Añadir Primer Colaborador
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px" }}>
          {initialMembers.map((m) => (
            <div key={m.id} className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "white"
                    }}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", color: "#fff" }}>{m.name}</h3>
                      <div style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: "600" }}>
                        {m.role}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981"
                  }}>
                    {m.status}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  {m.company && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>🏢</span>
                      <span>Empresa: <strong style={{ color: "#fff" }}>{m.company}</strong></span>
                    </div>
                  )}
                  {m.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>📞</span>
                      <span>{m.phone}</span>
                    </div>
                  )}
                  {m.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>✉️</span>
                      <span>{m.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => handleDelete(m.id)}
                  style={{ color: "#f87171", fontSize: "12px", fontWeight: "600" }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Añadir Miembro */}
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
            maxWidth: "500px",
            width: "100%",
            padding: "32px",
            background: "#0f172a"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "20px" }}>Añadir Colaborador al Equipo</h2>
              <button onClick={() => setIsOpen(false)} style={{ color: "var(--text-secondary)", fontSize: "20px" }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Nombre Completo *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Ej: Carlos Gómez"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Rol en Obra *</label>
                  <select 
                    name="role"
                    defaultValue="Jefe de Obra"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none" }}
                  >
                    <option value="Arquitecto Director">Arquitecto Director</option>
                    <option value="Jefe de Obra">Jefe de Obra</option>
                    <option value="Maestro de Obra">Maestro de Obra</option>
                    <option value="Oficial de Albañilería">Oficial Albañilería</option>
                    <option value="Electricista">Electricista</option>
                    <option value="Fontanero">Fontanero</option>
                    <option value="Estructurista">Estructurista</option>
                    <option value="Subcontratista">Subcontratista</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Empresa / Subcontrata</label>
                  <input 
                    type="text" 
                    name="company" 
                    placeholder="Ej: Climatizaciones Sur"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Teléfono</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="+34 600 000 000"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="carlos@empresa.com"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
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
                  {loading ? "Guardando..." : "Guardar Colaborador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason || "Has alcanzado el límite de 2 colaboradores del Plan Gratuito. Pasa a CertiObra PRO para añadir cuadrillas y subcontratistas ilimitados."}
      />
    </div>
  );
}
