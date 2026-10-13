"use client";

interface DashboardChartsProps {
  projects: {
    name: string;
    budget: number;
    spent: number;
    progress: number;
    status: string;
  }[];
}

export default function DashboardCharts({ projects }: DashboardChartsProps) {
  if (projects.length === 0) return null;

  const maxBudget = Math.max(...projects.map((p) => Math.max(p.budget, p.spent)), 1);
  
  // Status distribution
  const statusCounts = {
    PLANIFICACION: projects.filter((p) => p.status === "PLANIFICACION").length,
    EN_EJECUCION: projects.filter((p) => p.status === "EN_EJECUCION").length,
    PARALIZADA: projects.filter((p) => p.status === "PARALIZADA").length,
    FINALIZADA: projects.filter((p) => p.status === "FINALIZADA").length,
  };

  const statusConfig = [
    { key: "PLANIFICACION", label: "Planificación", color: "#60a5fa", count: statusCounts.PLANIFICACION },
    { key: "EN_EJECUCION", label: "En Ejecución", color: "#10b981", count: statusCounts.EN_EJECUCION },
    { key: "PARALIZADA", label: "Paralizada", color: "#f59e0b", count: statusCounts.PARALIZADA },
    { key: "FINALIZADA", label: "Finalizada", color: "#8b5cf6", count: statusCounts.FINALIZADA },
  ];

  const total = projects.length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "20px", marginBottom: "32px" }}>
      {/* Budget vs Spending Chart */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0" }}>
          📊 Presupuesto vs. Gasto por Obra
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 20px 0" }}>
          Comparativa financiera de cada proyecto
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {projects.slice(0, 6).map((p) => {
            const budgetWidth = (p.budget / maxBudget) * 100;
            const spentWidth = (p.spent / maxBudget) * 100;
            const overBudget = p.spent > p.budget && p.budget > 0;

            return (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: "11px", color: overBudget ? "#f87171" : "var(--text-secondary)" }}>
                    {p.spent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })} / {p.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div style={{ position: "relative", height: "20px" }}>
                  {/* Budget bar (background) */}
                  <div style={{
                    position: "absolute", top: 0, left: 0,
                    width: `${budgetWidth}%`,
                    height: "100%",
                    background: "rgba(96, 165, 250, 0.2)",
                    borderRadius: "6px",
                  }} />
                  {/* Spent bar (foreground) */}
                  <div style={{
                    position: "absolute", top: "3px", left: 0,
                    width: `${spentWidth}%`,
                    height: "14px",
                    background: overBudget
                      ? "linear-gradient(90deg, #f87171, #ef4444)"
                      : "linear-gradient(90deg, #10b981, #34d399)",
                    borderRadius: "4px",
                    transition: "width 0.5s ease",
                    boxShadow: overBudget ? "0 0 8px rgba(248,113,113,0.4)" : "0 0 8px rgba(16,185,129,0.3)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "20px", marginTop: "16px", fontSize: "11px", color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(96,165,250,0.4)" }} />
            Presupuesto
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#10b981" }} />
            Gasto ejecutado
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#f87171" }} />
            Sobrepresupuesto
          </div>
        </div>
      </div>

      {/* Progress & Status Distribution */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0" }}>
          📈 Estado y Avance de Obras
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 20px 0" }}>
          Distribución por estado y progreso medio
        </p>

        {/* Status distribution ring-like chart */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
          {/* Visual ring */}
          <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              {(() => {
                let cumulative = 0;
                return statusConfig.filter((s) => s.count > 0).map((s) => {
                  const pct = s.count / total;
                  const dashArray = pct * 251.2; // 2 * pi * 40
                  const dashOffset = -cumulative * 251.2;
                  cumulative += pct;
                  return (
                    <circle
                      key={s.key}
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="12"
                      strokeDasharray={`${dashArray} ${251.2 - dashArray}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      style={{ transition: "all 0.5s ease" }}
                    />
                  );
                });
              })()}
              <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                fill="#fff" fontSize="22" fontWeight="800">
                {total}
              </text>
            </svg>
          </div>

          {/* Status legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            {statusConfig.map((s) => (
              <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual project progress bars */}
        <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Avance por Proyecto
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {projects.slice(0, 6).map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#fff", minWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </span>
              <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{
                  width: `${p.progress}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: p.progress >= 80 ? "linear-gradient(90deg, #10b981, #34d399)"
                    : p.progress >= 40 ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                    : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                  transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#fff", minWidth: "36px", textAlign: "right" }}>
                {p.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
