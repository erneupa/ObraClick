import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Información detallada sobre el uso de cookies técnicas y de preferencias en ObraClick conforme a la guía de la AEPD.",
  alternates: {
    canonical: "/cookies",
  },
};

export const instant = false;

export default function CookiesPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-color)" }}>
      {/* Header */}
      <header style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--surface-border)",
        background: "rgba(11, 15, 25, 0.8)",
        backdropFilter: "blur(16px)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "20px" }}>🏗️</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#fff" }}>
              Obra<span style={{ color: "var(--accent-primary)" }}>Click</span>
            </span>
          </Link>
          <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "14px", textDecoration: "none" }}>
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: "860px", margin: "0 auto", padding: "60px 24px" }}>
        <div className="glass-panel" style={{ padding: "48px 40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", background: "rgba(59, 130, 246, 0.15)", color: "var(--accent-primary)", fontSize: "12px", fontWeight: "700", marginBottom: "16px" }}>
            <span>🍪</span> GUÍA DE COOKIES AEPD
          </div>

          <h1 style={{ fontSize: "32px", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            Política de Cookies
          </h1>
          <p className="text-secondary" style={{ marginBottom: "32px", fontSize: "14px" }}>
            Información transparente sobre el uso de cookies y almacenamiento local conforme al artículo 22.2 de la LSSI-CE.
          </p>

          <section style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.7", color: "var(--text-secondary)", fontSize: "15px" }}>
            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>1. ¿Qué es una cookie?</h2>
              <p style={{ margin: 0 }}>
                Una cookie es un pequeño fichero de texto que se descarga en su navegador al acceder a determinadas páginas web. Permite a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y facilitar el acceso seguro al panel de control de obra.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 12px 0" }}>2. Tipos de cookies utilizadas en ObraClick</h2>
              <p style={{ margin: "0 0 16px 0" }}>
                En ObraClick aplicamos el principio de <strong>privacidad por diseño y por defecto</strong>. No vendemos datos a intermediarios publicitarios.
              </p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "#fff" }}>
                      <th style={{ padding: "10px" }}>Nombre</th>
                      <th style={{ padding: "10px" }}>Tipo</th>
                      <th style={{ padding: "10px" }}>Finalidad</th>
                      <th style={{ padding: "10px" }}>Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "10px", fontWeight: "600", color: "#fff" }}>next-auth.session-token</td>
                      <td style={{ padding: "10px" }}>Técnica / Esencial</td>
                      <td style={{ padding: "10px" }}>Mantenimiento seguro de la sesión del usuario en el dashboard</td>
                      <td style={{ padding: "10px" }}>Sesión / 30 días</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "10px", fontWeight: "600", color: "#fff" }}>next-auth.csrf-token</td>
                      <td style={{ padding: "10px" }}>Seguridad</td>
                      <td style={{ padding: "10px" }}>Protección contra ataques Cross-Site Request Forgery</td>
                      <td style={{ padding: "10px" }}>Sesión</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px", fontWeight: "600", color: "#fff" }}>obraclick_cookie_consent</td>
                      <td style={{ padding: "10px" }}>Preferencias</td>
                      <td style={{ padding: "10px" }}>Registro de la elección del banner de cookies del usuario</td>
                      <td style={{ padding: "10px" }}>12 meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>3. ¿Cómo configurar o deshabilitar las cookies?</h2>
              <p style={{ margin: "0 0 10px 0" }}>
                Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador o dispositivo móvil:
              </p>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
                <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y Seguridad &gt; Cookies y datos del sitio.</li>
                <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
                <li><strong>Microsoft Edge:</strong> Configuración &gt; Permisos del sitio &gt; Cookies y datos del sitio.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>4. Actualización de la Política de Cookies</h2>
              <p style={{ margin: 0 }}>
                ObraClick puede modificar esta Política de Cookies en función de nuevas exigencias legislativas, reglamentarias o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos (AEPD).
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
