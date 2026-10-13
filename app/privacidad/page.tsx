import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos (RGPD)",
  description: "Política de privacidad y tratamiento de datos personales conforme al Reglamento General de Protección de Datos (RGPD) en ObraClick.",
  alternates: {
    canonical: "/privacidad",
  },
};

export const instant = false;

export default function PrivacidadPage() {
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "12px", fontWeight: "700", marginBottom: "16px" }}>
            <span>🔒</span> RGPD (UE 2016/679) Y LOPDGDD 3/2018
          </div>

          <h1 style={{ fontSize: "32px", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="text-secondary" style={{ marginBottom: "32px", fontSize: "14px" }}>
            Última actualización: Octubre de 2026. Conforme al Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales.
          </p>

          <section style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.7", color: "var(--text-secondary)", fontSize: "15px" }}>
            
            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>1. Responsable del Tratamiento</h2>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>Identidad:</strong> ObraClick (Equipo de Desarrollo Tecnológico y Titular del Servicio)<br />
                <strong>Naturaleza:</strong> Plataforma de software en fase Beta y validación operativa<br />
                <strong>Email de Privacidad y Ejercicio de Derechos (ARCO/RGPD):</strong> privacidad@obraclick.es / soporte@obraclick.es<br />
                <strong>Delegado de Privacidad:</strong> dpo@obraclick.es
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>2. Fines y Base Jurídica del Tratamiento</h2>
              <p style={{ margin: "0 0 8px 0" }}>Los datos personales son tratados con las siguientes finalidades y bases legítimas:</p>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>
                  <strong>Gestión de la cuenta y prestación del servicio SaaS:</strong> Registro de usuarios, gestión de proyectos de obra, hitos, partes diarios y control de costes. <em>(Base: Ejecución de contrato - Art. 6.1.b RGPD).</em>
                </li>
                <li>
                  <strong>Facturación y cobro de suscripciones:</strong> Emisión de facturas fiscales y procesamiento de pagos con Stripe. <em>(Base: Obligación legal tributaria y contable - Art. 6.1.c RGPD).</em>
                </li>
                <li>
                  <strong>Comunicaciones de seguridad y servicio:</strong> Notificaciones sobre hitos, incidencias críticas y alertas presupuestarias. <em>(Base: Interés legítimo y ejecución contractual).</em>
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>3. Datos de Terceros y Encargo de Tratamiento (Art. 28 RGPD)</h2>
              <p style={{ margin: 0 }}>
                Cuando el usuario (constructora, arquitecto o promotor) introduce en ObraClick datos de carácter personal relativos a operarios, subcontratas, técnicos o clientes finales (por ejemplo, en el módulo de Equipo o en Partes Diarios), el <strong>Usuario actúa como Responsable del Tratamiento</strong> y <strong>ObraClick actúa en calidad de Encargado del Tratamiento</strong>. ObraClick tratará dichos datos únicamente siguiendo las instrucciones documentadas del cliente y aplicará medidas técnicas y organizativas para garantizar su estricta confidencialidad.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>4. Plazo de Conservación</h2>
              <p style={{ margin: 0 }}>
                Los datos se conservarán mientras se mantenga la relación de suscripción activa y, posteriormente, durante los plazos legalmente exigibles para la prescripción de responsabilidades fiscales (4 años), contractuales (5 años) o las derivadas de la garantía decenal y registros de edificación conforme a la Ley de Ordenación de la Edificación (LOE).
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>5. Medidas de Seguridad y Encriptación</h2>
              <p style={{ margin: 0 }}>
                Aplicamos cifrado en tránsito mediante protocolos TLS 1.3 / SSL de 256 bits, contraseñas hasheadas mediante algoritmos robustos (bcrypt) y aislamiento estricto por inquilino (*tenant isolation*) en bases de datos con copias de seguridad redundantes.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "19px", color: "#fff", margin: "0 0 8px 0" }}>6. Derechos del Usuario (ARCO-POL) y Cómo Ejercerlos</h2>
              <p style={{ margin: "0 0 10px 0" }}>
                Usted ostenta el derecho a:
              </p>
              <ul style={{ paddingLeft: "20px", margin: "0 0 10px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Acceso:</strong> Conocer qué datos personales tratamos sobre usted.</li>
                <li><strong>Rectificación:</strong> Modificar datos inexactos desde su panel de Ajustes.</li>
                <li><strong>Supresión (Derecho al Olvido):</strong> Solicitar el borrado irreversible de su cuenta y sus datos asociados.</li>
                <li><strong>Portabilidad:</strong> Descargar una copia completa de sus datos en formato estructurado e interoperable (JSON).</li>
                <li><strong>Limitación y Oposición:</strong> Limitar u oponerse a determinados tratamientos en los términos previstos en la ley.</li>
              </ul>
              <p style={{ margin: 0 }}>
                Puede ejercer estos derechos directamente desde su panel de <Link href="/dashboard/settings" style={{ color: "var(--accent-primary)" }}>Ajustes de Cuenta</Link> o enviando un correo a <strong>privacidad@obraclick.es</strong> con copia de su documento de identidad. Asimismo, tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)" }}>www.aepd.es</a>.
              </p>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
