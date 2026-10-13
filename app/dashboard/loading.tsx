export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "pulse 1.5s infinite" }}>
      {/* Top Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: "240px", height: "32px", background: "rgba(255,255,255,0.06)", borderRadius: "8px" }} />
        <div style={{ width: "140px", height: "40px", background: "rgba(255,255,255,0.06)", borderRadius: "10px" }} />
      </div>

      {/* KPI Cards Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-panel"
            style={{ height: "110px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={{ width: "60%", height: "14px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
            <div style={{ width: "80%", height: "28px", background: "rgba(255,255,255,0.08)", borderRadius: "6px" }} />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="glass-panel" style={{ height: "350px", padding: "24px" }}>
        <div style={{ width: "200px", height: "20px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", marginBottom: "20px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3, 4].map((row) => (
            <div key={row} style={{ width: "100%", height: "48px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
