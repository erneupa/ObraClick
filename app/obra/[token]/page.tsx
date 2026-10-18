import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const project = await prisma.project.findUnique({
    where: { clientToken: token },
    select: { name: true, clientName: true },
  });

  if (!project) return { title: "Obra no encontrada | ObraClick" };

  return {
    title: `${project.name} — Portal del Cliente | ObraClick`,
    description: `Seguimiento en tiempo real de la obra "${project.name}"${project.clientName ? ` para ${project.clientName}` : ""}. Consulta hitos, avance y fotografías.`,
    robots: { index: false, follow: false },
  };
}

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const project = await prisma.project.findUnique({
    where: { clientToken: token },
    include: {
      milestones: { orderBy: { order: "asc" } },
      dailyReports: { orderBy: { createdAt: "desc" }, take: 20 },
      incidents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) {
    notFound();
  }

  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;
  const openIncidents = project.incidents.filter((i) => i.status !== "RESUELTA").length;

  const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
    PLANIFICACION: { label: "📋 En Planificación", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
    EN_EJECUCION: { label: "⚙️ En Ejecución", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    PARALIZADA: { label: "⏸️ Paralizada", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    FINALIZADA: { label: "✅ Finalizada", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  };

  const st = statusLabels[project.status] || statusLabels.EN_EJECUCION;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0b0f19 0%, #1a233a 50%, #0b0f19 100%)",
      color: "#f8fafc",
      fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
    }}>
      {/* Header Bar */}
      <header style={{
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "800", color: "#fff",
          }}>O</div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>ObraClick</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Portal del Cliente</div>
          </div>
        </div>
        <div style={{
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "600",
          background: st.bg,
          color: st.color,
          border: `1px solid ${st.color}30`,
        }}>
          {st.label}
        </div>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 14px 60px" }}>
        {/* Project Hero */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "24px 18px",
          marginBottom: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
        }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            {project.name}
          </h1>
          <p style={{ color: "#94a3b8", margin: "0 0 20px 0", fontSize: "14px" }}>
            📍 {project.location || "Sin localización"}
            {project.clientName && <span> — Cliente: <strong style={{ color: "#fff" }}>{project.clientName}</strong></span>}
          </p>
          {project.description && (
            <p style={{ color: "#cbd5e1", margin: "0 0 20px 0", fontSize: "14px", lineHeight: "1.6" }}>
              {project.description}
            </p>
          )}

          {/* Progress Bar */}
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8" }}>Avance Global de la Obra</span>
              <strong style={{ color: "#fff" }}>{project.progress}%</strong>
            </div>
            <div style={{ width: "100%", height: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{
                width: `${project.progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                borderRadius: "999px",
                transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "12px", marginBottom: "28px" }}>
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
            padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hitos Completados</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981" }}>{completedMilestones} / {totalMilestones}</div>
          </div>
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
            padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Presupuesto Total</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#60a5fa" }}>
              {project.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </div>
          </div>
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
            padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Gasto Ejecutado</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981" }}>
              {project.spent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </div>
          </div>
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
            padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Incidencias Abiertas</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: openIncidents > 0 ? "#f87171" : "#10b981" }}>{openIncidents}</div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div style={{
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
          padding: "28px", marginBottom: "28px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>
            🏗️ Fases e Hitos de la Obra
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {project.milestones.map((m: any, i: number) => (
              <div key={m.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                {/* Timeline line */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", width: "32px", flexShrink: 0,
                }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: m.completed ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.08)",
                    border: m.completed ? "none" : "2px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: "#fff", flexShrink: 0,
                    boxShadow: m.completed ? "0 0 12px rgba(16,185,129,0.4)" : "none",
                  }}>
                    {m.completed ? "✓" : i + 1}
                  </div>
                  {i < project.milestones.length - 1 && (
                    <div style={{
                      width: "2px", flexGrow: 1, minHeight: "32px",
                      background: m.completed ? "#10b981" : "rgba(255,255,255,0.1)",
                    }} />
                  )}
                </div>
                <div style={{ paddingBottom: "20px", flex: 1 }}>
                  <div style={{
                    fontSize: "15px", fontWeight: "600",
                    color: m.completed ? "#10b981" : "#fff",
                    textDecoration: m.completed ? "line-through" : "none",
                    opacity: m.completed ? 0.8 : 1,
                  }}>
                    {m.title}
                  </div>
                  {m.description && (
                    <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>{m.description}</div>
                  )}
                  {m.completed && m.completedAt && (
                    <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px" }}>
                      ✅ Completado el {new Date(m.completedAt).toLocaleDateString("es-ES")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Reports (Gallery) */}
        {project.dailyReports.length > 0 && (
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
            padding: "28px", marginBottom: "28px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>
              📸 Diario de Obra — Últimos partes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {project.dailyReports.map((r: any) => (
                <div key={r.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "18px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "15px" }}>{r.title}</strong>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {new Date(r.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "14px", margin: "0 0 10px 0", lineHeight: "1.5" }}>
                    {r.notes}
                  </p>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                    {r.weather && <span>🌤️ {r.weather}</span>}
                    {r.workersCount > 0 && <span>👷 {r.workersCount} operarios</span>}
                  </div>
                  {r.imageUrl && (
                    <div style={{ marginTop: "12px" }}>
                      <img
                        src={r.imageUrl}
                        alt={`Foto del parte: ${r.title}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "12px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  {r.signatureUrl && (
                    <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: "8px", padding: "6px 12px", width: "fit-content" }}>
                      <img src={r.signatureUrl} alt="Firma digital" style={{ height: "24px", objectFit: "contain", background: "#fff", borderRadius: "4px", padding: "2px 6px" }} />
                      <span style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "600" }}>✓ Firmado y certificado por el jefe de obra</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incidents */}
        {project.incidents.length > 0 && (
          <div style={{
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
            padding: "28px", marginBottom: "28px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 20px 0" }}>
              ⚠️ Incidencias ({openIncidents} abiertas)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {project.incidents.map((inc: any) => {
                const priorityColors: Record<string, string> = {
                  BAJA: "#60a5fa", MEDIA: "#f59e0b", ALTA: "#f97316", URGENTE: "#ef4444",
                };
                const statusIcons: Record<string, string> = {
                  ABIERTA: "🔴", EN_PROCESO: "🟡", EN_REVISION: "🟡", RESUELTA: "🟢",
                };
                const priorityColor = priorityColors[inc.priority] || "#94a3b8";
                return (
                  <div key={inc.id} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span>{statusIcons[inc.status] || "🔴"}</span>
                        <strong style={{ fontSize: "14px" }}>{inc.title}</strong>
                      </div>
                      <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{inc.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700",
                        background: `${priorityColor}20`,
                        color: priorityColor,
                      }}>
                        {inc.priority}
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {new Date(inc.createdAt).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#64748b", fontSize: "12px", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ margin: "0 0 4px 0" }}>
            Portal de seguimiento generado por <strong style={{ color: "#94a3b8" }}>ObraClick</strong>
          </p>
          <p style={{ margin: 0 }}>
            Software de gestión de obras · <Link href="/" style={{ color: "#3b82f6", textDecoration: "underline" }}>obraclick.com</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
