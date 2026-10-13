"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OBRACLICK ERROR]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "radial-gradient(circle at top, #1a233a 0%, #0b0f19 70%)",
        color: "#f8fafc",
        textAlign: "center",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "48px 32px",
          borderRadius: "24px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>⚠️</div>
        <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 10px 0", color: "#f87171" }}>
          Ha ocurrido un imprevisto
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
          Se ha producido un error al cargar la información. Puedes reintentar la acción o volver al panel de control.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => reset()}
            className="btn-primary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
          >
            🔄 Reintentar Carga
          </button>
          <Link
            href="/dashboard"
            className="btn-secondary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
