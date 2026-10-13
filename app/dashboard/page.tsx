import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateProjectModal from "@/components/CreateProjectModal";
import DashboardCharts from "@/components/DashboardCharts";

export const instant = false;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          include: {
            milestones: true,
            expenses: true,
            incidents: true,
            dailyReports: true,
          },
          orderBy: { createdAt: "desc" },
        },
        teamMembers: true,
      },
    });
  }

  const projects = dbUser?.projects || [];
  const teamMembers = dbUser?.teamMembers || [];

  const activeProjects = projects.filter((p) => p.status === "EN_EJECUCION" || p.status === "PLANIFICACION");
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const totalIncidentsOpen = projects.reduce((acc, p) => acc + p.incidents.filter((i) => i.status !== "RESUELTA").length, 0);

  // Collect recent activity across all projects
  const recentReports = projects.flatMap((p) => 
    p.dailyReports.map((r) => ({ ...r, projectName: p.name }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const isPro = dbUser?.plan === "PRO" || dbUser?.plan === "ENTERPRISE";
  const trialEndsAt = dbUser?.trialEndsAt || (!isPro ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null);
  const isTrialExpired = !isPro && trialEndsAt ? new Date() > new Date(trialEndsAt) : false;
  const trialDaysRemaining = !isPro && trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Vista General
          </h1>
          <p className="text-secondary" style={{ margin: 0, fontSize: "15px" }}>
            Bienvenido, <strong style={{ color: "#fff" }}>{dbUser?.name || "Usuario"}</strong>. Resumen ejecutivo de tus obras y cuadrillas.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <CreateProjectModal />
        </div>
      </header>

      {/* Trial Countdown / Expiration Banner */}
      {!isPro && trialEndsAt && (
        isTrialExpired ? (
          <div style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>⏳</span>
              <div>
                <h4 style={{ margin: 0, color: "#f87171", fontSize: "15px", fontWeight: "700" }}>
                  Tu período de prueba de 14 días ha finalizado
                </h4>
                <p style={{ margin: "2px 0 0 0", color: "#e2e8f0", fontSize: "13px" }}>
                  La plataforma está en modo solo lectura. Pasa a ObraClick PRO para seguir creando obras, registrando partes y certificando sin marca de agua.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/suscripcion"
              className="btn-primary"
              style={{
                padding: "9px 18px",
                fontSize: "13px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                textDecoration: "none"
              }}
            >
              Activar Plan PRO (79€/mes) →
            </Link>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "14px",
            padding: "14px 20px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>🕒</span>
              <div>
                <div style={{ color: "#93c5fd", fontSize: "14px", fontWeight: "700" }}>
                  Período de Prueba Activo: {trialDaysRemaining} {trialDaysRemaining === 1 ? "día restante" : "días restantes"} (de 14 días)
                </div>
                <p style={{ margin: "2px 0 0 0", color: "var(--text-secondary)", fontSize: "12px" }}>
                  Disfruta de todas las funciones para tu obra. Los informes en versión de prueba incluyen marca de agua legal.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/suscripcion"
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)"
              }}
            >
              Desbloquear Plan PRO →
            </Link>
          </div>
        )
      )}

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div className="glass-panel" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>Obras Activas</span>
            <span style={{ fontSize: "22px", background: "rgba(59, 130, 246, 0.15)", padding: "8px", borderRadius: "10px" }}>🏗️</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "white", marginBottom: "4px" }}>
            {activeProjects.length}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            {projects.length} obras registradas en total
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>Presupuesto Ejecutado</span>
            <span style={{ fontSize: "22px", background: "rgba(16, 185, 129, 0.15)", padding: "8px", borderRadius: "10px" }}>💰</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#10b981", marginBottom: "4px" }}>
            {totalSpent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            de {totalBudget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })} previsto
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>Incidencias Pendientes</span>
            <span style={{ fontSize: "22px", background: "rgba(239, 68, 68, 0.15)", padding: "8px", borderRadius: "10px" }}>⚠️</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: totalIncidentsOpen > 0 ? "#f87171" : "#10b981", marginBottom: "4px" }}>
            {totalIncidentsOpen}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            {totalIncidentsOpen === 0 ? "Todo bajo control en obra" : "Requieren supervisión técnica"}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>Personal de Equipo</span>
            <span style={{ fontSize: "22px", background: "rgba(245, 158, 11, 0.15)", padding: "8px", borderRadius: "10px" }}>👷</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#f59e0b", marginBottom: "4px" }}>
            {teamMembers.length}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            colaboradores y cuadrillas
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {projects.length > 0 && (
        <DashboardCharts projects={projects.map((p) => ({
          name: p.name,
          budget: p.budget,
          spent: p.spent,
          progress: p.progress,
          status: p.status,
        }))} />
      )}

      {/* Main Content Area: Projects Grid & Activity */}
      <div className="dashboard-two-column-grid">
        
        {/* Left Column: Projects List */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}>Tus Obras en Curso</h2>
            <Link href="/dashboard/proyectos" style={{ fontSize: "14px", color: "var(--accent-primary)", fontWeight: "600" }}>
              Ver todas ({projects.length}) →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="glass-panel" style={{ padding: "48px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏗️</div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>Aún no tienes obras creadas</h3>
              <p className="text-secondary" style={{ maxWidth: "420px", margin: "0 auto 24px", fontSize: "14px" }}>
                Comienza registrando tu primer proyecto de construcción para controlar su presupuesto, hitos e incidencias.
              </p>
              <CreateProjectModal />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {projects.slice(0, 4).map((p) => {
                const spentPercentage = p.budget > 0 ? Math.min(100, Math.round((p.spent / p.budget) * 100)) : 0;
                return (
                  <Link 
                    key={p.id} 
                    href={`/dashboard/proyectos/${p.id}`}
                    className="glass-panel"
                    style={{
                      padding: "20px 24px",
                      display: "block",
                      transition: "all 0.2s ease",
                      border: "1px solid var(--surface-border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: "700", color: "#fff" }}>
                          {p.name}
                        </h3>
                        <p className="text-secondary" style={{ margin: 0, fontSize: "13px" }}>
                          📍 {p.location || "Sin ubicación"} {p.clientName ? `• Cliente: ${p.clientName}` : ""}
                        </p>
                      </div>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: p.status === "EN_EJECUCION" ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                        color: p.status === "EN_EJECUCION" ? "#10b981" : "#60a5fa"
                      }}>
                        {p.status === "EN_EJECUCION" ? "En Ejecución" : p.status}
                      </span>
                    </div>

                    {/* Progress Bars */}
                    <div style={{ marginTop: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                        <span className="text-secondary">Avance técnico de obra:</span>
                        <strong style={{ color: "#fff" }}>{p.progress}%</strong>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ width: `${p.progress}%`, height: "100%", background: "var(--accent-primary)", borderRadius: "999px", transition: "width 0.4s ease" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "13px" }}>
                      <span className="text-secondary">
                        Gastado: <strong style={{ color: "#fff" }}>{p.spent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</strong> / {p.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </span>
                      <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>
                        Ver Detalles →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity & Quick Team */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Recent Reports / Bitácora */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", margin: "0 0 16px 0", fontWeight: "700" }}>
              Actividad Reciente en Obra
            </h3>
            {recentReports.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                No hay partes diarios registrados aún. Entra a una obra para registrar el informe del día.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {recentReports.map((r) => (
                  <div key={r.id} style={{ paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>{r.projectName}</span>
                      <span>{new Date(r.createdAt).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "4px" }}>
                      {r.title}
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                      {r.notes.slice(0, 90)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Team View */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", margin: 0, fontWeight: "700" }}>Equipo de Obra</h3>
              <Link href="/dashboard/equipo" style={{ fontSize: "13px", color: "var(--accent-primary)" }}>
                Gestionar →
              </Link>
            </div>
            {teamMembers.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                No has añadido colaboradores. Registra jefes de obra, arquitectos o cuadrillas en la pestaña Equipo.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {teamMembers.slice(0, 4).map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#fff" }}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {m.role} {m.company ? `• ${m.company}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
