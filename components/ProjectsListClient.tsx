"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { deleteProject } from "@/lib/actions";
import { toast } from "./ToastProvider";

interface ProjectsListClientProps {
  projects: any[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PLANIFICACION: { label: "📋 Planificación", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  EN_EJECUCION: { label: "⚙️ En Ejecución", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  PARALIZADA: { label: "⏸️ Paralizada", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  FINALIZADA: { label: "✅ Finalizada", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
};

export default function ProjectsListClient({ projects }: ProjectsListClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [sortBy, setSortBy] = useState<"reciente" | "nombre" | "presupuesto" | "progreso">("reciente");

  const filteredProjects = useMemo(() => {
    let result = projects;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.clientName && p.clientName.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "TODOS") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "nombre": return a.name.localeCompare(b.name);
        case "presupuesto": return b.budget - a.budget;
        case "progreso": return b.progress - a.progress;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [projects, search, statusFilter, sortBy]);

  // Stats per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { TODOS: projects.length };
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [projects]);

  async function handleDelete(projectId: string, projectName: string) {
    if (!confirm(`¿Seguro que deseas eliminar la obra "${projectName}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProject(projectId);
      toast(`Obra "${projectName}" eliminada`, "info");
    } catch {
      toast("Error al eliminar la obra", "error");
    }
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {/* Search */}
        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "var(--text-secondary)" }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, cliente o localización..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px 11px 42px",
              borderRadius: "12px",
              border: "1px solid var(--surface-border)",
              background: "rgba(0,0,0,0.2)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{
            padding: "11px 16px",
            borderRadius: "12px",
            border: "1px solid var(--surface-border)",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="reciente">Más recientes</option>
          <option value="nombre">Nombre A-Z</option>
          <option value="presupuesto">Mayor presupuesto</option>
          <option value="progreso">Mayor avance</option>
        </select>
      </div>

      {/* Status filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { key: "TODOS", label: "Todas", color: "#fff", bg: "rgba(255,255,255,0.08)" },
          ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({ key, label: cfg.label, color: cfg.color, bg: cfg.bg })),
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            style={{
              padding: "7px 16px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "600",
              background: statusFilter === item.key ? item.bg : "rgba(255,255,255,0.03)",
              color: statusFilter === item.key ? item.color : "var(--text-secondary)",
              border: statusFilter === item.key ? `1px solid ${item.color}40` : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {item.label}
            <span style={{
              background: "rgba(255,255,255,0.08)",
              padding: "1px 7px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "700",
              color: "var(--text-secondary)",
            }}>
              {statusCounts[item.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          {filteredProjects.length} {filteredProjects.length === 1 ? "resultado" : "resultados"} para &ldquo;<strong style={{ color: "#fff" }}>{search}</strong>&rdquo;
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ margin: "0 0 8px 0" }}>No se encontraron obras</h3>
          <p className="text-secondary" style={{ margin: 0, fontSize: "14px" }}>
            {search ? "Intenta con otro término de búsqueda." : "No hay obras en el estado seleccionado."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "20px" }}>
          {filteredProjects.map((p) => {
            const openIncidents = p.incidents.filter((i: any) => i.status !== "RESUELTA").length;
            const completedMilestones = p.milestones.filter((m: any) => m.completed).length;
            const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.EN_EJECUCION;

            return (
              <div
                key={p.id}
                className="glass-panel"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background: st.bg,
                      color: st.color,
                    }}>
                      {st.label}
                    </span>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {openIncidents > 0 && (
                        <span style={{ fontSize: "12px", color: "#f87171", background: "rgba(239, 68, 68, 0.15)", padding: "4px 8px", borderRadius: "6px", fontWeight: "600" }}>
                          ⚠️ {openIncidents}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Eliminar obra"
                        style={{
                          width: "28px", height: "28px",
                          borderRadius: "6px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px",
                          background: "none",
                          border: "none",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                          opacity: 0.5,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "20px", margin: "0 0 6px 0", fontWeight: "700", color: "#fff" }}>
                    {p.name}
                  </h3>

                  <p className="text-secondary" style={{ margin: "0 0 16px 0", fontSize: "14px", lineHeight: "1.5" }}>
                    {p.location ? `📍 ${p.location}` : "Sin ubicación asignada"}
                    {p.clientName ? ` • ${p.clientName}` : ""}
                  </p>

                  {/* Progress Info */}
                  <div style={{ marginBottom: "16px", padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                      <span className="text-secondary">Progreso ({completedMilestones}/{p.milestones.length})</span>
                      <strong style={{ color: "#fff" }}>{p.progress}%</strong>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${p.progress}%`, height: "100%", background: "var(--accent-primary)", borderRadius: "999px", transition: "width 0.5s" }} />
                    </div>
                  </div>

                  {/* Financials */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "20px" }}>
                    <div>
                      <span className="text-secondary" style={{ display: "block", fontSize: "11px" }}>EJECUTADO</span>
                      <strong style={{ color: "#10b981", fontSize: "15px" }}>
                        {p.spent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </strong>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="text-secondary" style={{ display: "block", fontSize: "11px" }}>PRESUPUESTO</span>
                      <strong style={{ color: "#fff", fontSize: "15px" }}>
                        {p.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {p.dailyReports.length} partes · {p.expenses.length} gastos
                  </div>
                  <Link
                    href={`/dashboard/proyectos/${p.id}`}
                    className="btn-primary"
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                  >
                    Gestionar →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
