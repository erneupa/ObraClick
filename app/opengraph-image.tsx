import { ImageResponse } from "next/og";


export const alt = "CertiObra | El Software #1 de Control y Gestión de Obras y Reformas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0b0f19 0%, #0f172a 60%, #1e293b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0) 70%)",
          }}
        />

        {/* Header / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
            }}
          >
            🏗️
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "36px", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px" }}>
              Obra<span style={{ color: "#3b82f6" }}>Click</span>
            </span>
            <span style={{ fontSize: "14px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700" }}>
              Control & Gestión de Obras
            </span>
          </div>
        </div>

        {/* Center Title and Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "1000px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "999px",
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#60a5fa", fontWeight: "700" }}>
              ⚡ PLATAFORMA LÍDER DE CONSTRUCCIÓN Y REFORMAS
            </span>
          </div>
          <h1
            style={{
              fontSize: "62px",
              fontWeight: "900",
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            Controla tu obra en tiempo real.
            <br />
            <span style={{ color: "#60a5fa" }}>Cero desvíos, máxima rentabilidad.</span>
          </h1>
          <p style={{ fontSize: "24px", color: "#cbd5e1", margin: 0, lineHeight: 1.4 }}>
            Partes diarios digitales • Control de presupuestos • Hitos fotográficos • Certificaciones
          </p>
        </div>

        {/* Footer Metrics */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#60a5fa" }}>+1,450</span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>Obras Gestionadas</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#10b981" }}>99.2%</span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>Precisión Presupuestaria</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#fbbf24" }}>4.9 / 5 ⭐</span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>Valoración Constructores</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px", color: "#ffffff", fontWeight: "700" }}>certiobra.com</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
