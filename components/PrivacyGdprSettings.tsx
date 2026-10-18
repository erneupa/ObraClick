"use client";

import { useState } from "react";
import { exportUserData, deleteUserAccount } from "@/lib/actions";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "./ToastProvider";

export default function PrivacyGdprSettings() {
  const [downloading, setDownloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleExportData() {
    setDownloading(true);
    try {
      const data = await exportUserData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `certiobra_datos_personales_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast("Archivo JSON con tus datos descargado correctamente", "success");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error al exportar los datos", "error");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await deleteUserAccount();
      toast("Tu cuenta y todos tus datos han sido eliminados conforme al RGPD.", "info");
      signOut({ callbackUrl: "/" });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error al eliminar la cuenta", "error");
      setDeleting(false);
    }
  }

  return (
    <div style={{ marginTop: "36px", paddingTop: "28px", borderTop: "1px solid var(--surface-border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "18px" }}>🔒</span>
        <h3 style={{ fontSize: "18px", margin: 0, color: "#fff" }}>Privacidad y Cumplimiento RGPD</h3>
      </div>
      <p className="text-secondary" style={{ fontSize: "13px", margin: "0 0 20px 0", lineHeight: "1.5" }}>
        Conforme al Reglamento General de Protección de Datos (RGPD) de la UE, puedes ejercer tus derechos de portabilidad de datos y supresión permanente en cualquier momento.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Export Data Card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--surface-border)",
          borderRadius: "10px",
          padding: "16px"
        }}>
          <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px", color: "#fff" }}>
            Portabilidad de Datos (Art. 20)
          </strong>
          <p className="text-secondary" style={{ fontSize: "12px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
            Descarga una copia completa en formato estructurado (JSON) de tus obras, hitos, gastos y partes diarios.
          </p>
          <button
            onClick={handleExportData}
            disabled={downloading}
            className="btn-secondary"
            style={{ width: "100%", padding: "8px 12px", fontSize: "12px" }}
          >
            {downloading ? "Generando JSON..." : "📦 Descargar mis datos (JSON)"}
          </button>
        </div>

        {/* Delete Account Card */}
        <div style={{
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "10px",
          padding: "16px"
        }}>
          <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px", color: "#f87171" }}>
            Derecho al Olvido (Art. 17)
          </strong>
          <p className="text-secondary" style={{ fontSize: "12px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
            Elimina tu cuenta y borra irreversiblemente todas tus obras registradas y registros asociados.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn-secondary"
            style={{ width: "100%", padding: "8px 12px", fontSize: "12px", color: "#f87171", borderColor: "rgba(239, 68, 68, 0.4)" }}
          >
            ⚠️ Eliminar mi cuenta
          </button>
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <span>Documentación Legal:</span>
        <Link href="/aviso-legal" target="_blank" style={{ color: "var(--accent-primary)" }}>Aviso Legal</Link>
        <Link href="/privacidad" target="_blank" style={{ color: "var(--accent-primary)" }}>Política de Privacidad</Link>
        <Link href="/cookies" target="_blank" style={{ color: "var(--accent-primary)" }}>Política de Cookies</Link>
        <Link href="/terminos" target="_blank" style={{ color: "var(--accent-primary)" }}>Términos de Servicio</Link>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 300,
          padding: "20px"
        }}>
          <div className="glass-panel slide-up" style={{
            maxWidth: "440px",
            width: "100%",
            padding: "28px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ fontSize: "19px", margin: "0 0 8px 0", color: "#fff" }}>
              ¿Confirmas la eliminación permanente?
            </h3>
            <p className="text-secondary" style={{ fontSize: "13px", lineHeight: "1.5", margin: "0 0 24px 0" }}>
              Esta acción es irreversible conforme al derecho al olvido del RGPD. Se destruirán todos tus proyectos, hitos, gastos imputados y partes diarios asociados.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: "10px" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="btn-primary"
                style={{ flex: 1, padding: "10px", background: "#ef4444", borderColor: "#ef4444" }}
              >
                {deleting ? "Borrando..." : "Sí, borrar todo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
