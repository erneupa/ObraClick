import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import LandingHeader from "@/components/LandingHeader";
import InteractiveCalculator from "@/components/InteractiveCalculator";
import InteractiveFeatureTabs from "@/components/InteractiveFeatureTabs";
import { getSiteUrl } from "@/lib/site";

export const instant = false;

const siteUrl = getSiteUrl();

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es CertiObra y qué ventajas ofrece frente a Excel o WhatsApp?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CertiObra es el software en la nube líder para la gestión integral de obras, reformas y proyectos de construcción. Unifica en una sola plataforma a jefes de obra, arquitectos, cuadrillas y clientes, sustituyendo carpetas físicas y hojas de cálculo desactualizadas por un control financiero en tiempo real, diario fotográfico y cronograma Gantt digital."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo funciona el control presupuestario y la alerta de sobrecostes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cada compra, albarán o factura de materiales y mano de obra se registra al instante por partidas y categorías. La plataforma calcula automáticamente las desviaciones frente al presupuesto de ejecución por contrata y emite alertas visuales antes de que los sobrecostes comprometan el margen del proyecto."
      }
    },
    {
      "@type": "Question",
      "name": "¿Mis operarios y subcontratas necesitan instalar una app complicada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. CertiObra funciona como una Progressive Web App (PWA) de última generación directamente en el navegador del teléfono móvil o tablet (iOS y Android). No requiere descargas pesadas y cuenta con una interfaz táctil optimizada para el uso con guantes y condiciones de obra."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo se elabora el diario de obra digital con fotografías?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Con un par de toques desde el teléfono móvil, el encargado o jefe de obra fotografía el avance de los tajos, registra el personal activo, la meteorología y redacta notas técnicas. El sistema genera informes en PDF con sellado temporal listos para remitir a la dirección facultativa o a la propiedad."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo probar CertiObra gratis y qué incluye la prueba?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Puedes registrarte al instante con tu cuenta de Google sin introducir ninguna tarjeta de crédito. Dispones de un periodo de prueba de 14 días con acceso completo para gestionar tu primera obra, partes diarios, hitos y gastos sin ningún coste ni permanencia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cumple la plataforma con la normativa legal y protección de datos (RGPD)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Totalmente. CertiObra cumple con el Reglamento General de Protección de Datos (RGPD), la LSSI-CE y los estándares de seguridad de la edificación (LOE), alojando los datos con cifrado SSL/TLS de 256 bits y copias de seguridad continuas en centros de datos europeos de alta disponibilidad."
      }
    }
  ]
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": siteUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Software de Gestión de Obras",
      "item": `${siteUrl}/#caracteristicas`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Precios",
      "item": `${siteUrl}/#precios`
    }
  ]
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflowX: "hidden" }}>
      {/* Schema.org JSON-LD Structured Data for FAQ & Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdFaq),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBreadcrumb),
        }}
      />

      {/* Ambient aurora background mesh */}
      <div className="aurora-mesh">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
      </div>
      <div className="glow-spot" style={{ top: "900px", right: "-100px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)" }} />

      {/* Responsive Navigation Header */}
      <LandingHeader hasSession={!!session} />

      {/* Main Content Landmark */}
      <main style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: "80px 24px 60px", maxWidth: "1280px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
          <div className="badge-live slide-up" style={{ marginBottom: "24px" }}>
            <span className="live-dot" />
            <span>CERTIOBRA 2.0 • Digitalización Inteligente y Certificación de Obras</span>
          </div>

          <h1 className="slide-up" style={{
            fontSize: "clamp(34px, 5.5vw, 64px)",
            fontWeight: "800",
            lineHeight: "1.12",
            margin: "0 auto 24px",
            maxWidth: "1050px",
            letterSpacing: "-1.5px"
          }}>
            Software de Control y Certificación de Obras:<br />
            <span className="gradient-text shimmer-text">Cero desvíos, máxima rentabilidad en tiempo real.</span>
          </h1>

          <p className="slide-up text-secondary" style={{
            fontSize: "clamp(17px, 2vw, 21px)",
            lineHeight: "1.6",
            maxWidth: "800px",
            margin: "0 auto 40px"
          }}>
            La solución en la nube #1 para <strong style={{ color: "#fff" }}>constructoras, arquitectos, jefes de obra y reformas</strong>. Controla presupuestos, certificaciones, diario de obra digital con fotos e incidencias en un solo clic.
          </p>

          <div className="slide-up hero-buttons-container" style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
            <Link href="/login" className="btn-primary" style={{ padding: "16px 36px", fontSize: "18px", borderRadius: "14px" }} id="btn-hero-start">
              <span>Empezar Gratis Ahora (14 Días)</span>
              <span>→</span>
            </Link>
            <a href="#modulos" className="btn-secondary" style={{ padding: "16px 32px", fontSize: "18px", borderRadius: "14px" }} id="btn-hero-demo">
              <span>Ver Módulos en Acción</span>
              <span>📱</span>
            </a>
          </div>

          {/* Live Social Proof Metrics */}
          <div className="hero-metrics-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            maxWidth: "960px",
            margin: "0 auto 60px",
            padding: "24px",
            borderRadius: "18px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--surface-border)"
          }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--accent-primary)" }}>+1,450</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Obras y reformas gestionadas</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#10b981" }}>99.2%</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Precisión en control de costes</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#f59e0b" }}>18 hrs</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Ahorro semanal en trámites y visitas</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#a855f7" }}>4.9 / 5 ⭐</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Valoración de constructoras</div>
            </div>
          </div>

          {/* High-Impact Hero Showcase Visual with Floating Glass Cards */}
          <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 50px rgba(59, 130, 246, 0.25)",
              background: "#080c14",
              position: "relative"
            }}>
              <img 
                src="/hero-construction.png" 
                alt="CertiObra - Software de gestión y control integral de obras y reformas en tiempo real" 
                style={{ width: "100%", height: "auto", display: "block", maxHeight: "620px", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(11, 15, 25, 0.8) 0%, rgba(11, 15, 25, 0) 50%)"
              }} />
            </div>

            {/* Floating UI Badges */}
            <div className="floating-chip" style={{ position: "absolute", top: "12%", left: "-20px", zIndex: 20 }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Presupuesto Ejecutado</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>1.420.000€ <span style={{ color: "#10b981", fontSize: "12px" }}>(-4.2% desvío)</span></div>
              </div>
            </div>

            <div className="floating-chip" style={{ position: "absolute", bottom: "14%", right: "-20px", zIndex: 20, animationDelay: "-2s" }}>
              <div style={{ fontSize: "20px" }}>👷</div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Personal en Obra Hoy</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>38 Operarios Activos <span style={{ color: "var(--accent-primary)", fontSize: "12px" }}>• 4 Cuadrillas</span></div>
              </div>
            </div>

            <div className="floating-chip" style={{ position: "absolute", bottom: "8%", left: "40px", zIndex: 20, animationDelay: "-1s" }}>
              <div style={{ fontSize: "20px" }}>✅</div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Último Hito Certificado</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>Estructura Planta 4 Completada</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Platform / Visual Modules Section */}
        <section id="modulos" style={{ padding: "100px 24px", maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="badge badge-amber" style={{ marginBottom: "16px" }}>
              <span>DISEÑADO PARA EL TERRENO Y LA OFICINA</span>
            </div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              Módulos de Gestión de Obras: <span className="gradient-text">Panel Táctil Inteligente</span>
            </h2>
            <p className="text-secondary" style={{ maxWidth: "680px", margin: "0 auto", fontSize: "18px", lineHeight: "1.6" }}>
              Supervisa desde cualquier dispositivo: móvil, tablet o PC. Controla al milímetro compras, partes diarios, incidencias y la curva de desviación presupuestaria.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "center",
            marginBottom: "80px"
          }}>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="feature-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "24px", background: "rgba(59, 130, 246, 0.2)", padding: "10px", borderRadius: "12px" }}>📊</div>
                    <h3 style={{ margin: 0, fontSize: "20px" }}>Control de Costes y Desviación Presupuestaria</h3>
                  </div>
                  <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5", fontSize: "15px" }}>
                    Compara en tiempo real el presupuesto aprobado frente al coste real ejecutado. Alertas tempranas en compras de hierro, hormigón y acabados para proteger el margen.
                  </p>
                </div>

                <div className="feature-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "24px", background: "rgba(16, 185, 129, 0.2)", padding: "10px", borderRadius: "12px" }}>📅</div>
                    <h3 style={{ margin: 0, fontSize: "20px" }}>Cronograma Gantt de Hitos y Certificaciones</h3>
                  </div>
                  <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5", fontSize: "15px" }}>
                    Planificación estructurada de cimentación, estructura, instalaciones y acabados. Medición automática del progreso porcentual general de la obra.
                  </p>
                </div>

                <div className="feature-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "24px", background: "rgba(245, 158, 11, 0.2)", padding: "10px", borderRadius: "12px" }}>🛡️</div>
                    <h3 style={{ margin: 0, fontSize: "20px" }}>Gestión de Incidencias en Obra</h3>
                  </div>
                  <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5", fontSize: "15px" }}>
                    Registra cualquier no conformidad directamente con fotos en el móvil, asigna subcontrata responsable y establece niveles de prioridad (*Urgente, Alta, Media, Baja*).
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              background: "#0d1322"
            }}>
              <img 
                src="/dashboard-preview.png" 
                alt="Panel de control táctil de obra en tiempo real con estadísticas y gráficos CertiObra" 
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>

          {/* Interactive Live Simulated Demos */}
          <div style={{ marginTop: "40px" }}>
            <InteractiveFeatureTabs />
          </div>
        </section>

        {/* 6 Key Features Grid */}
        <section id="caracteristicas" style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="badge" style={{ marginBottom: "16px" }}>
              <span>FUNCIONALIDADES CLAVE</span>
            </div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              Herramientas de Construcción para <span className="gradient-text">Eliminar el Papeleo</span>
            </h2>
            <p className="text-secondary" style={{ maxWidth: "640px", margin: "0 auto", fontSize: "18px" }}>
              Reemplaza los grupos caóticos de WhatsApp, los albaranes arrugados y los Excels desfasados con tecnología en la nube.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px"
          }}>
            <div className="feature-card">
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>📸</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Diario de Obra con Fotos y Clima</h3>
              <p className="text-secondary" style={{ margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
                Registra partes diarios con fotos geolocalizadas, climatología y número de operarios. Genera actas diarias y reportes PDF automáticos para la dirección facultativa.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>📑</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Certificaciones Mensuales de Obra</h3>
              <p className="text-secondary" style={{ margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
                Controla el avance por capítulos y emite certificaciones periódicas con firma digital de arquitectos y aparejadores listas para facturación.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>👥</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Control de Cuadrillas & Subcontratas</h3>
              <p className="text-secondary" style={{ margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
                Supervisa el trabajo de instaladores, fontanería, albañilería y carpintería. Asigna tajos concretos y reduce tiempos muertos en obra.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>💰</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Control de Albaranes y Facturas</h3>
              <p className="text-secondary" style={{ margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
                Digitaliza albaranes al recibirlos a pie de obra con la cámara del móvil. Clasifícalos por proveedor y comprueba que coincidan con la orden de compra.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>📱</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>PWA Móvil Ultrarrápida</h3>
              <p className="text-secondary" style={{ margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
                Acceso sin fricciones en iPhone, iPad, Android y tablets de obra. Funciona con máxima fluidez y bajo consumo de datos móviles en el terreno.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔒</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Seguridad y Cumplimiento Normativo</h3>
              <p className="text-secondary" style={{ margin: 0, lineHeight: "1.6", fontSize: "15px" }}>
                Cifrado bancario SSL de 256 bits, cumplimiento íntegro del RGPD y de la Ley de Ordenación de la Edificación (LOE). Máxima confidencialidad en tus planos y costes.
              </p>
            </div>
          </div>
        </section>

        {/* Target Audience / Roles Section */}
        <section id="para-quien" style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="badge badge-amber" style={{ marginBottom: "16px" }}>
              <span>ADAPTADO A TU ROL</span>
            </div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              Software Diseñado para <span className="gradient-text">Profesionales de la Construcción</span>
            </h2>
            <p className="text-secondary" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "18px" }}>
              Una solución colaborativa donde cada agente de la edificación encuentra las herramientas que necesita.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="glass-panel" style={{ padding: "32px 24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>📐</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 8px" }}>Arquitectos y Aparejadores</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Supervisa que la ejecución material se ajuste al proyecto técnico y las memorias constructivas. Valida hitos y certificaciones sin desplazamientos innecesarios.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "32px 24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🦺</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 8px" }}>Jefes de Obra y Encargados</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                El cuaderno de bitácora digital en el móvil. Rellena el parte diario en 3 minutos, coordina gremios y documenta cualquier incidencia con fotos fechadas.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "32px 24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🏢</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 8px" }}>Constructoras y Empresas de Reformas</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Visión panorámica de todas tus obras en un único panel. Control exhaustivo de rentabilidad por partida, cobros a clientes y pagos a subcontratistas.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "32px 24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤝</div>
              <h3 style={{ fontSize: "20px", margin: "0 0 8px" }}>Promotores y Clientes Finales</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Máxima confianza y transparencia. Acceso al avance fotográfico de la reforma o promoción en tiempo real, evitando malentendidos y reclamaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Specialized Solutions SEO Grid */}
        <section id="soluciones" style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div className="badge" style={{ marginBottom: "16px" }}>
              <span>SECTORES Y ESPECIALIDADES</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              Soluciones Especializadas por <span className="gradient-text">Tipo de Obra</span>
            </h2>
            <p className="text-secondary" style={{ maxWidth: "680px", margin: "0 auto", fontSize: "17px" }}>
              Adaptado a la normativa constructiva y a la dinámica de trabajo de cada especialidad en España y Latinoamérica.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div className="glass-panel" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>🔨</div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px", color: "#fff" }}>Reformas Integrales de Viviendas</h3>
              <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Control estricto de licencias, plazos de entrega ajustados y comunicación cristalina con el propietario sobre variaciones presupuestarias.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>🏗️</div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px", color: "#fff" }}>Edificación Residencial y Terciaria</h3>
              <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Seguimiento de fases estructurales (cimentación, forjados, cerramientos), control de laboratorio y certificaciones mensuales de obra.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>🏪</div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px", color: "#fff" }}>Locales Comerciales & Retail</h3>
              <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Obras «llave en mano» con hitos diarios rigurosos, coordinación simultánea de gremios técnicos y verificación fotográfica de acabados.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>🚜</div>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px", color: "#fff" }}>Obra Civil y Urbanizaciones</h3>
              <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Control de maquinaria pesada, movimientos de tierras, partes de viales y cumplimiento de protocolos de prevención de riesgos laborales.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section: Traditional Method vs CertiObra */}
        <section id="comparativa" style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              El Salto Cuántico en tu Gestión de Obra
            </h2>
            <p className="text-secondary" style={{ fontSize: "17px" }}>
              Compara el método tradicional en papel frente a la tranquilidad de digitalizar tu obra con CertiObra.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "32px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "15px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <th style={{ padding: "16px", color: "var(--text-secondary)", width: "35%" }}>Aspecto de Gestión</th>
                  <th style={{ padding: "16px", color: "#f87171", width: "32%" }}>❌ Método Tradicional</th>
                  <th style={{ padding: "16px", color: "#60a5fa", width: "33%" }}>✨ Con CertiObra</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>Reportes y Fotos de Avance</td>
                  <td style={{ padding: "16px", color: "var(--text-secondary)" }}>Fotos perdidas en chats de WhatsApp</td>
                  <td style={{ padding: "16px", color: "#93c5fd", fontWeight: "600" }}>Timeline fotográfico geolocalizado en la nube</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>Control de Costes y Desvíos</td>
                  <td style={{ padding: "16px", color: "var(--text-secondary)" }}>Excels desactualizados y sorpresas al cierre</td>
                  <td style={{ padding: "16px", color: "#93c5fd", fontWeight: "600" }}>Curva de presupuesto en tiempo real con alertas</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>Certificaciones Oficiales</td>
                  <td style={{ padding: "16px", color: "var(--text-secondary)" }}>Días de papeleo, firmas físicas y retrasos</td>
                  <td style={{ padding: "16px", color: "#93c5fd", fontWeight: "600" }}>Generación automática en 1 click con firma digital</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>Relación con el Cliente</td>
                  <td style={{ padding: "16px", color: "var(--text-secondary)" }}>Incertidumbre, llamadas y desconfianza</td>
                  <td style={{ padding: "16px", color: "#93c5fd", fontWeight: "600" }}>Portal transparente con acceso 24/7 al avance</td>
                </tr>
                <tr>
                  <td style={{ padding: "16px", fontWeight: "600" }}>Histórico y Albaranes</td>
                  <td style={{ padding: "16px", color: "var(--text-secondary)" }}>Facturas y albaranes traspapelados en caseta</td>
                  <td style={{ padding: "16px", color: "#93c5fd", fontWeight: "600" }}>Archivo digital inmutable de toda la vida de la obra</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive ROI & Savings Calculator Section */}
        <section id="calculadora" style={{ padding: "60px 24px", maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <InteractiveCalculator />
        </section>

        {/* Pricing Section */}
        <section id="precios" style={{ padding: "100px 24px", maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="badge" style={{ marginBottom: "16px" }}>
              <span>PLANES TRANSPARENTES Y ESCALABLES</span>
            </div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              Inversión que se Amortiza en la <span className="gradient-text">Primera Semana</span>
            </h2>
            <p className="text-secondary" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "18px" }}>
              Empieza gratis hoy mismo y escala cuando aumentes tus proyectos y cuadrillas activas.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", alignItems: "stretch" }}>
            {/* Plan Free */}
            <div className="glass-panel" style={{ padding: "40px 32px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "22px", margin: "0 0 8px" }}>Plan Gratuito</h3>
              <p className="text-secondary" style={{ margin: "0 0 24px", fontSize: "14px" }}>Para autónomos y reformas individuales de prueba.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "28px" }}>
                <span style={{ fontSize: "44px", fontWeight: "800" }}>0€</span>
                <span className="text-secondary">/ mes para siempre</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "14px", flex: 1, fontSize: "15px" }}>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> <strong>1 obra activa</strong> completa</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Hasta 2 miembros de equipo</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Partes diarios y control de hitos</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Presupuesto y gastos básicos</li>
              </ul>
              <Link href="/login" className="btn-secondary" style={{ width: "100%", justifyContent: "center" }} id="btn-pricing-free">
                Empezar Gratis Ahora
              </Link>
            </div>

            {/* Plan Pro - Featured */}
            <div className="glass-panel" style={{
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              border: "2px solid var(--accent-primary)",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.25)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                padding: "4px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.5px"
              }}>
                MÁS POPULAR ⭐
              </div>
              <h3 style={{ fontSize: "22px", margin: "0 0 8px" }}>Constructoras Pro</h3>
              <p className="text-secondary" style={{ margin: "0 0 24px", fontSize: "14px" }}>Para estudios y constructoras en pleno crecimiento.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "28px" }}>
                <span style={{ fontSize: "44px", fontWeight: "800", color: "var(--accent-primary)" }}>79€</span>
                <span className="text-secondary">/ mes</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "14px", flex: 1, fontSize: "15px" }}>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> <strong>Obras activas ilimitadas</strong></li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Certificaciones con firma digital</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Control de cuadrillas y subcontratas</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Alertas de desvío presupuestario</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Portal exclusivo para el cliente</li>
              </ul>
              <Link href="/login" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} id="btn-pricing-pro">
                Comenzar con Pro 🚀
              </Link>
            </div>

            {/* Plan Empresa */}
            <div className="glass-panel" style={{ padding: "40px 32px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "22px", margin: "0 0 8px" }}>Empresarial / Promotoras</h3>
              <p className="text-secondary" style={{ margin: "0 0 24px", fontSize: "14px" }}>Para grandes volúmenes y requerimientos a medida.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "28px" }}>
                <span style={{ fontSize: "44px", fontWeight: "800" }}>249€</span>
                <span className="text-secondary">/ mes o a medida</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "14px", flex: 1, fontSize: "15px" }}>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Todo lo incluido en Pro</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Integración con ERP y BIM</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Gestor de cuenta dedicado 24/7</li>
                <li style={{ display: "flex", gap: "10px" }}><span>✓</span> Onboarding presencial para jefes de obra</li>
              </ul>
              <Link href="/login" className="btn-secondary" style={{ width: "100%", justifyContent: "center" }} id="btn-pricing-enterprise">
                Contactar Asesor
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: "60px 24px 100px", maxWidth: "880px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 12px" }}>
              Preguntas Frecuentes sobre CertiObra
            </h2>
            <p className="text-secondary" style={{ fontSize: "16px" }}>Resolvemos las dudas habituales de directores de obra y constructores</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="glass-panel" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 10px", color: "var(--text-primary)" }}>¿Qué es CertiObra y qué ventajas ofrece frente a Excel o WhatsApp?</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                CertiObra es el software en la nube líder para la gestión integral de obras, reformas y proyectos de construcción. Unifica en una sola plataforma a jefes de obra, arquitectos, cuadrillas y clientes, sustituyendo carpetas físicas y hojas de cálculo desactualizadas por un control financiero en tiempo real, diario fotográfico y cronograma Gantt digital.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 10px", color: "var(--text-primary)" }}>¿Cómo funciona el control presupuestario y la alerta de sobrecostes?</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Cada compra, albarán o factura de materiales y mano de obra se registra al instante por partidas y categorías. La plataforma calcula automáticamente las desviaciones frente al presupuesto de ejecución por contrata y emite alertas visuales antes de que los sobrecostes comprometan el margen del proyecto.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 10px", color: "var(--text-primary)" }}>¿Mis operarios y subcontratas necesitan instalar una app complicada?</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                No. CertiObra funciona como una Progressive Web App (PWA) de última generación directamente en el navegador del teléfono móvil o tablet (iOS y Android). No requiere descargas pesadas y cuenta con una interfaz táctil optimizada para el uso con guantes y condiciones de obra.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 10px", color: "var(--text-primary)" }}>¿Cómo se elabora el diario de obra digital con fotografías?</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Con un par de toques desde el teléfono móvil, el encargado o jefe de obra fotografía el avance de los tajos, registra el personal activo, la meteorología y redacta notas técnicas. El sistema genera informes en PDF con sellado temporal listos para remitir a la dirección facultativa o a la propiedad.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 10px", color: "var(--text-primary)" }}>¿Puedo probar CertiObra gratis y qué incluye la prueba?</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Sí. Puedes registrarte al instante con tu cuenta de Google sin introducir ninguna tarjeta de crédito. Dispones de un periodo de prueba de 14 días con acceso completo para gestionar tu primera obra, partes diarios, hitos y gastos sin ningún coste ni permanencia.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 10px", color: "var(--text-primary)" }}>¿Cumple la plataforma con la normativa legal y protección de datos (RGPD)?</h3>
              <p className="text-secondary" style={{ margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Totalmente. CertiObra cumple con el Reglamento General de Protección de Datos (RGPD), la LSSI-CE y los estándares de seguridad de la edificación (LOE), alojando los datos con cifrado SSL/TLS de 256 bits y copias de seguridad continuas en centros de datos europeos de alta disponibilidad.
              </p>
            </div>
          </div>
        </section>

        {/* Massive Call To Action Banner */}
        <section style={{ padding: "40px 24px 100px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          <div className="glass-panel" style={{
            padding: "60px 40px",
            textAlign: "center",
            borderRadius: "32px",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.9) 80%)",
            boxShadow: "0 20px 60px -10px rgba(59, 130, 246, 0.3)"
          }}>
            <h2 style={{ fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 16px" }}>
              Empieza a Digitalizar tus Obras Hoy Mismo
            </h2>
            <p className="text-secondary" style={{ maxWidth: "600px", margin: "0 auto 36px", fontSize: "18px", lineHeight: "1.6" }}>
              Ahorra horas de visitas innecesarias, elimina sobrecostes imprevistos y dale a tus clientes el servicio profesional que esperan.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link href="/login" className="btn-primary" style={{ padding: "18px 44px", fontSize: "19px", borderRadius: "16px" }} id="btn-cta-bottom">
                <span>Crear mi Cuenta Gratis con Google</span>
                <span>→</span>
              </Link>
            </div>
            <div style={{ marginTop: "20px", fontSize: "13px", color: "var(--text-secondary)" }}>
              Acceso instantáneo • Configuración en menos de 2 minutos • Sin tarjeta requerida
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer style={{
        borderTop: "1px solid var(--surface-border)",
        background: "rgba(11, 15, 25, 0.95)",
        padding: "48px 24px 32px",
        marginTop: "auto"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🏗️</span>
            <div>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>CertiObra</span>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>
                Software de Gestión y Control de Obras Inteligente
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "var(--text-secondary)", flexWrap: "wrap" }}>
            <a href="#caracteristicas">Características</a>
            <a href="#modulos">Módulos</a>
            <a href="#soluciones">Soluciones</a>
            <a href="#precios">Precios</a>
            <a href="#faq">FAQ</a>
            <Link href="/aviso-legal">Aviso Legal</Link>
            <Link href="/terminos">Términos</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/login">Acceso Clientes</Link>
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} CertiObra. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
