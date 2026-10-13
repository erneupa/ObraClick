import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "./AuthButtons";
import ThemeToggle from "./ThemeToggle";

interface DashboardHeaderProps {
  plan?: string;
  trialEndsAt?: string | null;
}

export default async function DashboardHeader({ plan = "FREE", trialEndsAt = null }: DashboardHeaderProps) {
  const session = await getServerSession(authOptions);

  const isPro = plan === "PRO" || plan === "ENTERPRISE";
  const isTrialExpired = !isPro && trialEndsAt ? new Date() > new Date(trialEndsAt) : false;
  const trialDaysRemaining = !isPro && trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <header style={{
      height: "70px",
      borderBottom: "1px solid var(--surface-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "rgba(0,0,0,0.1)"
    }}>
      <div>
        {/* Trial Status Notice in Header */}
        {!isPro && trialEndsAt && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 12px",
            borderRadius: "999px",
            background: isTrialExpired ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.15)",
            border: `1px solid ${isTrialExpired ? "rgba(239, 68, 68, 0.35)" : "rgba(59, 130, 246, 0.3)"}`,
            fontSize: "12px",
            fontWeight: "600",
            color: isTrialExpired ? "#f87171" : "#93c5fd"
          }}>
            <span>{isTrialExpired ? "⏳" : "🕒"}</span>
            <span>
              {isTrialExpired 
                ? "Período de prueba finalizado • Modo solo lectura" 
                : `Prueba gratuita: quedan ${trialDaysRemaining} ${trialDaysRemaining === 1 ? "día" : "días"}`}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {session?.user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                <span>{session.user.name}</span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "1px 6px",
                  borderRadius: "6px",
                  background: (session.user as any).plan === "PRO" 
                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" 
                    : "rgba(255, 255, 255, 0.1)",
                  color: (session.user as any).plan === "PRO" ? "#000" : "var(--text-secondary)"
                }}>
                  {(session.user as any).plan === "PRO" ? "PRO ⭐" : "FREE"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                {(session.user as any).role || "Usuario"}
              </div>
            </div>
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--accent-primary)" }}
              />
            ) : (
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--surface-border)" }} />
            )}
          </div>
        )}
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
