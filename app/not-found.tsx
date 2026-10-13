import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "radial-gradient(circle at top, #1a233a 0%, #0b0f19 70%)",
        color: "#f8fafc",
        textAlign: "center",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "48px 32px",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>🚧</div>
        <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
          Página no encontrada
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", margin: "0 0 28px 0" }}>
          El enlace al que intentas acceder no existe, la obra ha cambiado de enlace o no tienes permisos para visualizar este recurso.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
          >
            Ir al Panel de Control →
          </Link>
          <Link
            href="/"
            className="btn-secondary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
          >
            Volver a la Página Principal
          </Link>
        </div>
      </div>
    </div>
  );
}
