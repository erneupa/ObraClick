import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso y Registro Profesional",
  description: "Inicia sesión o crea tu cuenta gratuita en ObraClick. Control de obras, cuadrillas, partes diarios y certificaciones en tiempo real.",
  alternates: {
    canonical: "/login",
  },
};

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "radial-gradient(circle at top, #1e293b 0%, #0b0f19 90%)" }}>
      <div className="glass-panel slide-up" style={{ padding: "40px 36px", width: "100%", maxWidth: "460px", textAlign: "center" }}>
        <a 
          href="/" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "6px", 
            color: "var(--text-secondary)", 
            fontSize: "14px", 
            marginBottom: "20px",
            textDecoration: "none"
          }}
        >
          ← Volver a ObraClick
        </a>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", padding: "10px", borderRadius: "14px", background: "rgba(59, 130, 246, 0.15)", marginBottom: "12px", color: "var(--accent-primary)", fontSize: "28px" }}>
            🏗️
          </div>
          <h1 style={{ fontSize: "26px", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Acceso Profesional</h1>
          <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5", fontSize: "14px" }}>
            Control de obras, cuadrillas y certificaciones en tiempo real.
          </p>
        </div>
        <div>
          <AuthForm serverError={params?.error} />
        </div>
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--surface-border)" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Al continuar aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>
      </div>
    </main>
  );
}
