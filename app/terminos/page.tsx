import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description: "Términos generales de contratación y condiciones de uso de la plataforma de software para obras ObraClick.",
  alternates: {
    canonical: "/terminos",
  },
};

export const instant = false;

export default function TerminosPage() {
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
            <span>📋</span> CONDICIONES GENERALES DE CONTRATACIÓN
          </div>

          <h1 style={{ fontSize: "32px", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            Términos y Condiciones de Contratación
          </h1>
          <p className="text-secondary" style={{ marginBottom: "32px", fontSize: "14px" }}>
            Vigente desde Octubre de 2026. Regula el acceso y la contratación de los servicios de la plataforma ObraClick.
          </p>

          <section style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.7", color: "var(--text-secondary)", fontSize: "15px" }}>
            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>1. Objeto y Ámbito de Aplicación</h2>
              <p style={{ margin: 0 }}>
                Las presentes Condiciones Generales regulan el acceso y uso de la plataforma digital ObraClick (el "Servicio"), ofrecida por el equipo titular de ObraClick como solución de software en la nube dirigida a profesionales de la construcción, reformas, arquitectura, promotoras e ingenierías (B2B), así como a usuarios del sector.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>2. Planes, Precios e Impuestos</h2>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Plan Free:</strong> Gratuito (0€/mes) con capacidad para 1 obra activa y hasta 2 miembros de equipo.</li>
                <li><strong>Plan Pro:</strong> Cuota mensual recurrente de 79€/mes (o equivalente anual), que otorga obras y equipo ilimitados.</li>
                <li><strong>Plan Enterprise:</strong> Cuota personalizada según las dimensiones del grupo constructor.</li>
                <li><strong>Impuestos:</strong> Los precios indicados no incluyen el Impuesto sobre el Valor Añadido (IVA español del 21%), el cual se desglosa y aplica en la correspondiente factura deducible.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>3. Sin Permanencia y Cancelación</h2>
              <p style={{ margin: 0 }}>
                Las suscripciones de ObraClick no exigen compromiso de permanencia. El usuario puede cancelar o reducir su plan a Free en cualquier momento desde el panel de Suscripción con efecto al finalizar el ciclo de facturación en curso, sin penalización económica alguna.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>4. Derecho de Desistimiento</h2>
              <p style={{ margin: 0 }}>
                En caso de que el cliente ostente la condición legal de consumidor conforme al Real Decreto Legislativo 1/2007, dispondrá de un plazo de 14 días naturales desde la contratación para desistir del contrato sin justificación. Para profesionales y empresas (B2B), las cuotas devengadas no son reembolsables una vez activado el acceso a las herramientas del software.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>5. Propiedad y Custodia de los Datos de Obra</h2>
              <p style={{ margin: 0 }}>
                El cliente conserva la propiedad íntegra e incondicional de todos los datos introducidos: mediciones, albaranes, partes fotográficos diarios, presupuestos y certificaciones. ObraClick garantiza el derecho del cliente a exportar sus datos en cualquier momento durante la vigencia de la suscripción.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>6. Nivel de Servicio (SLA) y Disponibilidad</h2>
              <p style={{ margin: 0 }}>
                ObraClick se compromete a realizar sus mejores esfuerzos técnicos para garantizar una disponibilidad operativa mensual de al menos el 99.8%, realizando copias de seguridad continuas para prevenir cualquier pérdida accidental de registros de obra.
              </p>
            </div>

            <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "12px", padding: "20px" }}>
              <h2 style={{ fontSize: "19px", color: "#f87171", margin: "0 0 8px 0" }}>
                7. Exclusión Expresa de Responsabilidad Técnica y Constructiva (LOE / CTE)
              </h2>
              <p style={{ margin: "0 0 10px 0", color: "#cbd5e1" }}>
                ObraClick es única y exclusivamente un <strong>proveedor de software informático y administrativo en la nube</strong>. En ningún caso ObraClick, su titular ni sus creadores, desarrolladores o colaboradores ostentan la condición de:
              </p>
              <ul style={{ paddingLeft: "20px", margin: "0 0 10px 0", color: "#cbd5e1", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Director de Obra, Director de Ejecución de la Obra o Proyectista conforme a la <strong>Ley 38/1999, de 5 de noviembre, de Ordenación de la Edificación (LOE)</strong>.</li>
                <li>Coordinador de Seguridad y Salud en fase de ejecución conforme al <strong>Real Decreto 1627/1997</strong> ni técnico en prevención de riesgos laborales.</li>
                <li>Auditor ni certificador oficial de ensayos de materiales, estructuras o instalaciones sujetas al <strong>Código Técnico de la Edificación (CTE)</strong>.</li>
              </ul>
              <p style={{ margin: 0, color: "#cbd5e1" }}>
                El usuario y sus técnicos competentes son los <strong>únicos y exclusivos responsables</strong> de la veracidad de los datos introducidos, de la ejecución material de los tajos, del cumplimiento de las normativas de seguridad laboral y de las certificaciones emitidas ante promotores, bancos o colegios oficiales.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>8. Límite Máximo de Responsabilidad e Indemnización</h2>
              <p style={{ margin: "0 0 8px 0" }}>
                En la máxima medida permitida por la legislación aplicable:
              </p>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Cap Económico:</strong> La responsabilidad económica total y acumulada de ObraClick frente al usuario por cualquier concepto (contractual, extracontractual, culpa o negligencia) quedará <strong>estrictamente limitada al importe total efectivamente abonado por el usuario en concepto de cuotas de suscripción durante los últimos tres (3) meses anteriores al hecho causante</strong>, o a una cuantía máxima de cincuenta euros (50,00 €) en caso de usuarios del plan Free.</li>
                <li><strong>Exclusión de Daños Indirectos:</strong> ObraClick no responderá en ningún caso por <strong>lucro cesante, pérdidas de beneficio, penalizaciones contractuales por retrasos en los plazos de obra, paralizaciones administrativas de tajos, multas de inspección de trabajo, ni daños emergentes, indirectos o morales</strong> derivados del uso, interrupción o fallo de la plataforma.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>9. Obligación de Custodia y Copias de Seguridad del Usuario</h2>
              <p style={{ margin: 0 }}>
                El usuario reconoce y acepta que es su deber profesional y legal conservar copias de seguridad locales y archivos originales de sus contratos, facturas oficiales, pólizas de seguro de responsabilidad civil decenal y documentación técnica ante posibles inspecciones de la Agencia Tributaria o litigios entre promotor y constructor.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>10. Legislación Aplicable y Jurisdicción Exclusiva</h2>
              <p style={{ margin: 0 }}>
                Las presentes condiciones se rigen por la legislación española. Para la resolución de cualesquiera controversias derivadas de la contratación B2B o uso de la plataforma, las partes se someten a la jurisdicción exclusiva de los <strong>Juzgados y Tribunales de la ciudad de Madrid (España)</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
