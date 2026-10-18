"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DASHBOARD ERROR]", error);
  }, [error]);

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div
        className="glass-panel slide-up"
        style={{
          maxWidth: "520px",
          width: "100%",
          padding: "36px 30px",
          borderRadius: "20px",
          textAlign: "center",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ fontSize: "44px", marginBottom: "14px" }}>⚠️</div>
        <h2 style={{ fontSize: "22px", margin: "0 0 10px 0", color: "#f87171" }}>
          Error al cargar esta sección
        </h2>
        <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
          Ha ocurrido un problema temporal al recuperar la información de la obra o del panel. Tu sesión y datos están a salvo.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            className="btn-primary"
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            🔄 Reintentar
          </button>
          <Link
            href="/dashboard"
            className="btn-secondary"
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Volver al Resumen
          </Link>
        </div>
      </div>
    </div>
  );
}
