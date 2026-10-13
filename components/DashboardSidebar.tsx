"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UpgradeModal from "@/components/UpgradeModal";

interface DashboardSidebarProps {
  plan?: string;
  projectCount?: number;
  trialEndsAt?: string | null;
}

export default function DashboardSidebar({ 
  plan: propPlan, 
  projectCount = 1,
  trialEndsAt = null 
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Resolved plan: prop or session or FREE
  const currentPlan = (propPlan || (session?.user as any)?.plan || "FREE").toUpperCase();
  const isPro = currentPlan === "PRO" || currentPlan === "ENTERPRISE";

  const isTrialExpired = !isPro && trialEndsAt ? new Date() > new Date(trialEndsAt) : false;
  const trialDaysRemaining = !isPro && trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const links = [
    { href: "/dashboard", label: "Vista General", icon: "📊" },
    { href: "/dashboard/proyectos", label: "Proyectos", icon: "🏗️" },
    { href: "/dashboard/equipo", label: "Equipo", icon: "👥" },
    { href: "/dashboard/finanzas", label: "Finanzas", icon: "💰" },
    { href: "/dashboard/suscripcion", label: "Suscripción", icon: "💳" },
  ];

  return (
    <>
      <aside style={{
        width: "260px",
        borderRight: "1px solid var(--surface-border)",
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        height: "100%",
        boxSizing: "border-box"
      }}>
        {/* Brand */}
        <div style={{ marginBottom: "28px", paddingLeft: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h2 style={{ margin: 0, fontSize: "20px", letterSpacing: "-0.5px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--accent-primary)" }}>🏗️</span> ObraClick
            </h2>
          </Link>
          <span style={{
            fontSize: "10px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            padding: "2px 6px",
            borderRadius: "6px",
            background: isPro ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "rgba(255,255,255,0.08)",
            color: isPro ? "#000" : "var(--text-secondary)",
          }}>
            {isPro ? "PRO" : "FREE"}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: isActive ? "white" : "var(--text-secondary)",
                  background: isActive ? "var(--accent-primary)" : "transparent",
                  textDecoration: "none",
                  fontWeight: isActive ? "600" : "400",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: "18px" }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Plan Status / Upgrade CTA */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {isPro ? (
            <div style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "12px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "20px" }}>⭐</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#10b981" }}>Plan PRO Activo</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Obras y cuadrillas ilimitadas</div>
              </div>
            </div>
          ) : (
            <div style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#f59e0b", background: "rgba(245, 158, 11, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                  PLAN FREE
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  {projectCount}/1 Obra
                </span>
              </div>

              {/* Countdown badge de prueba de 14 días */}
              {trialEndsAt && (
                <div style={{
                  marginBottom: "10px",
                  padding: "7px 9px",
                  borderRadius: "8px",
                  background: isTrialExpired ? "rgba(239, 68, 68, 0.18)" : "rgba(59, 130, 246, 0.15)",
                  border: `1px solid ${isTrialExpired ? "rgba(239, 68, 68, 0.35)" : "rgba(59, 130, 246, 0.3)"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "7px"
                }}>
                  <span style={{ fontSize: "14px" }}>{isTrialExpired ? "⚠️" : "🕒"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: "11px", 
                      fontWeight: "700", 
                      color: isTrialExpired ? "#f87171" : "#93c5fd" 
                    }}>
                      {isTrialExpired 
                        ? "Prueba caducada" 
                        : `${trialDaysRemaining} ${trialDaysRemaining === 1 ? "día restante" : "días restantes"}`}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                      {isTrialExpired ? "Modo solo lectura" : "Período de prueba de 14d"}
                    </div>
                  </div>
                </div>
              )}

              <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                {isTrialExpired 
                  ? "Actualiza a PRO para desbloquear la edición y crear nuevas obras." 
                  : "Pasa a PRO para tener obras ilimitadas y certificados limpios."}
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  fontSize: "12px",
                  fontWeight: "700",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)"
                }}
              >
                <span>⭐</span> Mejorar a PRO (79€)
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Link 
              href="/dashboard/settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "8px",
                color: pathname === "/dashboard/settings" ? "white" : "var(--text-secondary)",
                background: pathname === "/dashboard/settings" ? "rgba(255,255,255,0.08)" : "transparent",
                textDecoration: "none",
                fontSize: "13px",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "16px" }}>⚙️</span>
              Ajustes
            </Link>
            <Link 
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "8px",
                color: "var(--text-secondary)",
                fontSize: "13px",
                textDecoration: "none",
                opacity: 0.8
              }}
            >
              <span style={{ fontSize: "16px" }}>🌐</span>
              Web principal
            </Link>
          </div>
        </div>
      </aside>

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        reason="Desbloquea obras ilimitadas, cuadrillas sin tope y partes fotográficos geolocalizados para tu constructora."
      />
    </>
  );
}
