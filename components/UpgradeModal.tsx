"use client";

import { useState } from "react";
import { upgradeToPro } from "@/lib/actions";
import { toast } from "./ToastProvider";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleUpgrade() {
    setLoading(true);
    try {
      const result = await upgradeToPro();
      if (!result.ok) {
        toast(result.error, "error");
        return;
      }
      setSuccess(true);
      toast("¡Plan PRO activado con éxito!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      toast("Error al actualizar la suscripción. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="glass-panel slide-up" style={{
        maxWidth: "520px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "28px 20px",
        background: "radial-gradient(circle at top, #1e293b 0%, #0b0f19 90%)",
        border: "2px solid rgba(59, 130, 246, 0.4)",
        boxShadow: "0 25px 60px -15px rgba(59, 130, 246, 0.35)",
        position: "relative",
        textAlign: "center"
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "var(--text-secondary)",
            fontSize: "22px",
            lineHeight: 1,
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        {success ? (
          <div style={{ padding: "30px 10px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ fontSize: "24px", margin: "0 0 10px 0", color: "#fff" }}>¡Bienvenido a CertiObra PRO!</h2>
            <p className="text-secondary" style={{ fontSize: "15px", margin: 0 }}>
              Tu cuenta ha sido actualizada con éxito. Desbloqueando obras ilimitadas...
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              borderRadius: "999px",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#f59e0b",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "16px"
            }}>
              <span>⭐</span> PLAN RECOMENDADO PARA CONSTRUCTORAS
            </div>

            <h2 style={{ fontSize: "26px", margin: "0 0 10px 0", fontWeight: "800", color: "#fff" }}>
              Pasa a CertiObra PRO
            </h2>

            <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.5", margin: "0 0 24px" }}>
              {reason || "Has alcanzado el límite de 1 obra del Plan Gratuito. Actualiza a Pro para gestionar todos tus proyectos sin límites."}
            </p>

            {/* Price Box */}
            <div style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: "16px",
              padding: "18px",
              border: "1px solid var(--surface-border)",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "36px", fontWeight: "800", color: "var(--accent-primary)" }}>79€</span>
              <span className="text-secondary" style={{ fontSize: "14px" }}>/ mes (facturación flexible)</span>
            </div>

            {/* Value checklist */}
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "14px"
            }}>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
                <span><strong>Obras activas ilimitadas</strong> (frente a 1 en el Plan Free)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
                <span><strong>Cuadrillas y colaboradores ilimitados</strong></span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
                <span>Partes diarios con fotos geolocalizadas</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
                <span>Control de desviaciones presupuestarias en tiempo real</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
                <span>Facturas deducibles oficiales con IVA para tu empresa</span>
              </li>
            </ul>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)"
                }}
              >
                {loading ? "Activando Plan Pro..." : "🚀 Activar Plan Pro Ahora (79€/mes)"}
              </button>
              <button 
                onClick={onClose}
                className="btn-secondary"
                style={{ width: "100%", padding: "10px", fontSize: "13px", border: "none" }}
              >
                Continuar con el Plan Gratuito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
