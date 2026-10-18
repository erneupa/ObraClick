import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal e Información Corporativa",
  description: "Información legal, mercantil y condiciones de prestación de servicios de la plataforma CertiObra en cumplimiento de la LSSI-CE.",
  alternates: {
    canonical: "/aviso-legal",
  },
};

export const instant = false;

export default function AvisoLegalPage() {
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
            <span>⚖️</span> CUMPLIMIENTO LSSI-CE (LEY 34/2002)
          </div>

          <h1 style={{ fontSize: "32px", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            Aviso Legal e Información Corporativa
          </h1>
          <p className="text-secondary" style={{ marginBottom: "32px", fontSize: "14px" }}>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
          </p>

          <section style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.7", color: "var(--text-secondary)", fontSize: "15px" }}>
            
            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>1. Datos Identificativos del Proyecto y Contacto</h2>
              <p style={{ margin: "0 0 8px 0" }}>
                El presente sitio web y la plataforma CertiObra operan como un <strong>proyecto de software y desarrollo tecnológico en fase de prelanzamiento y Beta abierta</strong>:
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Nombre del Proyecto:</strong> CertiObra</li>
                <li><strong>Naturaleza del Servicio:</strong> Solución de software en la nube en periodo de evaluación tecnológica para profesionales y empresas del sector de la construcción.</li>
                <li><strong>Correo Electrónico de Contacto y Soporte:</strong> contacto@certiobra.com / soporte@certiobra.com</li>
                <li><strong>Finalidad:</strong> Pruebas operativas, recogida de feedback técnico y validación funcional sin comercialización obligatoria previa.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>2. Propiedad Intelectual e Industrial</h2>
              <p style={{ margin: 0 }}>
                El código fuente, diseños gráficos, interfaces, logotipos, algoritmos de cálculo de avances y desviaciones presupuestarias, textos y arquitectura de la plataforma CertiObra son titularidad exclusiva de los creadores y titulares de CertiObra o de sus licenciantes legítimos, encontrándose protegidos por la legislación española e internacional sobre propiedad intelectual e industrial (Real Decreto Legislativo 1/1996).
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>3. Exclusión de Responsabilidad Técnica y Facultativa</h2>
              <p style={{ margin: "0 0 8px 0" }}>
                CertiObra proporciona herramientas digitales para el seguimiento organizativo, documental, presupuestario y fotográfico de obras. Conforme a la <strong>Ley 38/1999, de 5 de noviembre, de Ordenación de la Edificación (LOE)</strong>:
              </p>
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                <li>CertiObra <strong>no ostenta ni asume</strong> la condición de Director de Obra, Director de Ejecución de la Obra ni Coordinador de Seguridad y Salud.</li>
                <li>Los datos de avance, mediciones y fotografías son introducidos por los usuarios facultativos habilitados, siendo estos los responsables exclusivos de su veracidad ante colegios oficiales, promotores y administraciones públicas.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>4. Legislación Aplicable y Jurisdicción</h2>
              <p style={{ margin: 0 }}>
                Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o con las actividades en él desarrolladas, será de aplicación la legislación española. Las partes se someten expresamente a los Juzgados y Tribunales de la ciudad de Madrid, con renuncia a cualquier otro fuero que pudiera corresponderles, sin perjuicio de los derechos que asistan a consumidores en virtud de la normativa de defensa del consumidor.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>5. Resolución de Litigios en Línea (ODR)</h2>
              <p style={{ margin: 0 }}>
                Conforme al Art. 14.1 del Reglamento (UE) 524/2013, la Comisión Europea facilita una plataforma de resolución de litigios en línea disponible en: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)" }}>https://ec.europa.eu/consumers/odr/</a>.
              </p>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
