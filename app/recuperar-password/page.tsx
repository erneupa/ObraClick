import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Restablece el acceso a tu cuenta en CertiObra.",
  alternates: {
    canonical: "/recuperar-password",
  },
};

export default function RecuperarPasswordPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "radial-gradient(circle at top, #1e293b 0%, #0b0f19 90%)",
      }}
    >
      <div
        className="glass-panel slide-up"
        style={{
          padding: "40px 36px",
          width: "100%",
          maxWidth: "460px",
          textAlign: "center",
        }}
      >
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            marginBottom: "20px",
            textDecoration: "none",
          }}
        >
          ← Volver a Iniciar Sesión
        </Link>

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "10px",
              borderRadius: "14px",
              background: "rgba(59, 130, 246, 0.15)",
              marginBottom: "12px",
              color: "var(--accent-primary)",
              fontSize: "28px",
            }}
          >
            🔐
          </div>
          <h1 style={{ fontSize: "24px", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            Recuperar Contraseña
          </h1>
          <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5", fontSize: "14px" }}>
            Accede de nuevo a tu panel de gestión de obras con total seguridad.
          </p>
        </div>

        <Suspense
          fallback={
            <div style={{ padding: "40px 0", color: "var(--text-secondary)", fontSize: "14px" }}>
              Cargando formulario...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--surface-border)" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            CertiObra · Gestión integral de obras y proyectos
          </p>
        </div>
      </div>
    </main>
  );
}
