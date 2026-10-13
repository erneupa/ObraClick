"use client";

import { useState } from "react";
import { upgradeToPro, downgradeToFree } from "@/lib/actions";

interface SubscriptionClientProps {
  currentPlan: string;
  userEmail: string;
  userName: string;
  projectCount: number;
  teamCount: number;
  trialEndsAt?: string | null;
}

export default function SubscriptionClient({
  currentPlan,
  userEmail,
  userName,
  projectCount,
  teamCount,
  trialEndsAt = null,
}: SubscriptionClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);

  const isPro = currentPlan === "PRO" || currentPlan === "ENTERPRISE";
  const isTrialExpired = !isPro && trialEndsAt ? new Date() > new Date(trialEndsAt) : false;
  const trialDaysRemaining = !isPro && trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  async function handleUpgrade() {
    setLoading("upgrade");
    setFeedback(null);
    try {
      await upgradeToPro();
      setFeedback({
        type: "success",
        message: "¡Plan PRO activado con éxito! Todas las limitaciones de obras y equipo han sido eliminadas."
      });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Error al procesar el cambio de plan"
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleDowngrade() {
    setShowDowngradeConfirm(false);
    setLoading("downgrade");
    setFeedback(null);
    try {
      await downgradeToFree();
      setFeedback({
        type: "success",
        message: "Tu cuenta ha vuelto al Plan Gratuito (límite de 1 obra activa)."
      });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Error al cambiar al plan gratuito"
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Header */}
      <header style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "999px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", color: "var(--accent-primary)", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
          <span>💳</span> GESTIÓN DE PLANES Y FACTURACIÓN
        </div>
        <h1 style={{ fontSize: "30px", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
          Suscripción y Capacidad de Obras
        </h1>
        <p className="text-secondary" style={{ margin: 0, fontSize: "15px", maxWidth: "700px" }}>
          Asegura la rentabilidad de tus proyectos de construcción. Escala de 1 a ilimitadas obras sin ataduras y con IVA 100% deducible.
        </p>
      </header>

      {/* Notification Banner */}
      {feedback && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "12px",
          marginBottom: "28px",
          background: feedback.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          border: `1px solid ${feedback.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          color: feedback.type === "success" ? "#34d399" : "#f87171",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Current Plan Overview Banner */}
      <div className="glass-panel" style={{
        padding: "24px 28px",
        borderRadius: "16px",
        marginBottom: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        border: isPro ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid var(--surface-border)",
        background: isPro ? "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" : "rgba(15, 23, 42, 0.5)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: isPro ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            color: isPro ? "#000" : "#fff"
          }}>
            {isPro ? "⭐" : "📦"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>
                Plan Actual: {isPro ? "ObraClick PRO" : "Plan Básico (Free)"}
              </span>
              <span style={{
                fontSize: "11px",
                fontWeight: "800",
                padding: "2px 8px",
                borderRadius: "6px",
                background: isPro 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : isTrialExpired 
                    ? "rgba(239, 68, 68, 0.2)" 
                    : "rgba(59, 130, 246, 0.2)",
                color: isPro 
                  ? "#10b981" 
                  : isTrialExpired 
                    ? "#f87171" 
                    : "#60a5fa"
              }}>
                {isPro ? "ACTIVO ⭐" : isTrialExpired ? "PRUEBA CADUCADA" : `PRUEBA ACTIVA (${trialDaysRemaining}d)`}
              </span>
            </div>
            <div className="text-secondary" style={{ fontSize: "13px" }}>
              {isPro
                ? `Obras activas: ${projectCount} (Ilimitadas) · Colaboradores: ${teamCount} (Ilimitados) · Facturación mensual recurrente`
                : trialEndsAt
                  ? (isTrialExpired
                      ? `Período de prueba de 14 días concluido. Cuenta en modo solo lectura. Actualiza para volver a editar.`
                      : `Período de prueba de 14 días: Te ${trialDaysRemaining === 1 ? "queda 1 día restante" : `quedan ${trialDaysRemaining} días restantes`}. · 1 obra máxima.`)
                  : `Obras activas: ${projectCount}/1 obra máxima · Colaboradores: ${teamCount}/2 miembros`}
            </div>
          </div>
        </div>

        <div>
          {isPro ? (
            <button
              onClick={() => setShowDowngradeConfirm(true)}
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "8px 16px" }}
              disabled={loading !== null}
            >
              Cambiar al Plan Gratuito
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              className="btn-primary"
              style={{
                fontSize: "14px",
                padding: "10px 20px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              disabled={loading !== null}
            >
              {loading === "upgrade" ? "Activando..." : "🚀 Desbloquear PRO (79€/mes)"}
            </button>
          )}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        
        {/* FREE PLAN */}
        <div className="glass-panel" style={{
          padding: "32px 24px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          border: !isPro ? "2px solid rgba(255, 255, 255, 0.2)" : "1px solid var(--surface-border)"
        }}>
          {!isPro && (
            <div style={{
              position: "absolute",
              top: "-12px",
              left: "24px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "2px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "700",
              color: "#fff"
            }}>
              PLAN ACTUAL
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", margin: "0 0 6px 0", color: "#fff" }}>Plan Free</h3>
            <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
              Para autónomos o reformas individuales de prueba.
            </p>
          </div>

          <div style={{ marginBottom: "24px", display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "40px", fontWeight: "800", color: "#fff" }}>0€</span>
            <span className="text-secondary" style={{ fontSize: "14px" }}>/ mes para siempre</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", flex: 1 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span><strong>1 obra activa</strong> simultánea</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Hasta <strong>2 miembros</strong> de cuadrilla</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Control de hitos y plazos</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Partes diarios básicos</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0.45 }}>
              <span style={{ color: "var(--text-secondary)" }}>✕</span>
              <span>Sin partes fotográficos geolocalizados</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0.45 }}>
              <span style={{ color: "var(--text-secondary)" }}>✕</span>
              <span>Sin alertas de sobrecoste</span>
            </li>
          </ul>

          <div>
            {!isPro ? (
              <button disabled className="btn-secondary" style={{ width: "100%", padding: "12px", opacity: 0.6 }}>
                Tu plan actual
              </button>
            ) : (
              <button 
                onClick={() => setShowDowngradeConfirm(true)}
                className="btn-secondary" 
                style={{ width: "100%", padding: "12px" }}
              >
                Volver a Free
              </button>
            )}
          </div>
        </div>

        {/* PRO PLAN (RECOMMENDED) */}
        <div className="glass-panel" style={{
          padding: "32px 24px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          border: "2px solid #3b82f6",
          background: "radial-gradient(circle at top, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)",
          boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.3)"
        }}>
          <div style={{
            position: "absolute",
            top: "-13px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            padding: "3px 14px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "800",
            color: "#fff",
            letterSpacing: "0.5px"
          }}>
            RECOMENDADO PARA CONSTRUCTORAS
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "20px", margin: "0 0 6px 0", color: "#fff" }}>ObraClick PRO</h3>
              <span style={{ fontSize: "20px" }}>⭐</span>
            </div>
            <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
              Para jefes de obra, constructoras y promotoras activas.
            </p>
          </div>

          <div style={{ marginBottom: "24px", display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "40px", fontWeight: "800", color: "var(--accent-primary)" }}>79€</span>
            <span className="text-secondary" style={{ fontSize: "14px" }}>/ mes + IVA (desgravable)</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", flex: 1 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span><strong>Obras ilimitadas</strong> simultáneas</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span><strong>Cuadrillas y colaboradores ilimitados</strong></span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span><strong>Partes fotográficos diarios geolocalizados</strong></span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span><strong>Control de gastos y alertas de sobrecoste</strong></span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Exportación de certificaciones en PDF para bancos/clientes</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Soporte prioritario directo por WhatsApp</span>
            </li>
          </ul>

          <div>
            {isPro ? (
              <button 
                disabled 
                className="btn-primary" 
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#10b981",
                  borderColor: "#10b981",
                  fontWeight: "700"
                }}
              >
                ✓ Plan Pro Activo
              </button>
            ) : (
              <button 
                onClick={handleUpgrade}
                disabled={loading === "upgrade"}
                className="btn-primary" 
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)"
                }}
              >
                {loading === "upgrade" ? "Activando..." : "🚀 Activar Plan Pro (79€/mes)"}
              </button>
            )}
          </div>
        </div>

        {/* ENTERPRISE PLAN */}
        <div className="glass-panel" style={{
          padding: "32px 24px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--surface-border)"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", margin: "0 0 6px 0", color: "#fff" }}>Enterprise</h3>
            <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
              Para grandes corporaciones, franquicias y grupos constructores.
            </p>
          </div>

          <div style={{ marginBottom: "24px", display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "40px", fontWeight: "800", color: "#fff" }}>249€</span>
            <span className="text-secondary" style={{ fontSize: "14px" }}>/ mes o a medida</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", flex: 1 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span><strong>Todo lo incluido en PRO</strong></span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Multi-sociedad / Multi-CIF en un solo panel</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Integración con ERPs (Presto, Menfis, SAP)</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>Onboarding presencial para personal de campo</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#10b981", fontWeight: "700" }}>✓</span>
              <span>SLA de respuesta técnica garantizada en 1h</span>
            </li>
          </ul>

          <div>
            <a 
              href="mailto:empresas@obraclick.es?subject=Consulta%20Plan%20Enterprise%20ObraClick"
              className="btn-secondary" 
              style={{
                width: "100%",
                padding: "12px",
                textAlign: "center",
                display: "block",
                textDecoration: "none"
              }}
            >
              Contactar con Ventas
            </a>
          </div>
        </div>

      </div>

      {/* Tax & Invoicing Section */}
      <div className="glass-panel" style={{ padding: "28px", borderRadius: "16px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "24px" }}>📄</span>
          <div>
            <h3 style={{ fontSize: "18px", margin: "0 0 2px 0" }}>Facturación y Fiscalidad Española</h3>
            <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
              Todas las cuotas de suscripción son 100% deducibles en el IRPF o Impuesto de Sociedades.
            </p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          padding: "16px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "12px",
          fontSize: "13px"
        }}>
          <div>
            <span className="text-secondary">Facturado a:</span>
            <div style={{ fontWeight: "600", marginTop: "2px", color: "#fff" }}>{userName || "Constructor / Técnico"}</div>
            <div className="text-secondary" style={{ fontSize: "12px" }}>{userEmail}</div>
          </div>
          <div>
            <span className="text-secondary">IVA Aplicable:</span>
            <div style={{ fontWeight: "600", marginTop: "2px", color: "#fff" }}>21% IVA Deducible</div>
            <div className="text-secondary" style={{ fontSize: "12px" }}>Régimen general España</div>
          </div>
          <div>
            <span className="text-secondary">Próximo Cobro:</span>
            <div style={{ fontWeight: "600", marginTop: "2px", color: isPro ? "#10b981" : "var(--text-secondary)" }}>
              {isPro ? "Renovación automática mensual" : "Sin cobros activos (Gratuito)"}
            </div>
            <div className="text-secondary" style={{ fontSize: "12px" }}>Cancela en 1 clic cuando quieras</div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="glass-panel" style={{ padding: "28px", borderRadius: "16px" }}>
        <h3 style={{ fontSize: "18px", margin: "0 0 16px 0" }}>Preguntas Frecuentes sobre la Suscripción</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", fontSize: "13px" }}>
          <div>
            <strong style={{ color: "#fff", display: "block", marginBottom: "4px" }}>
              ¿Hay permanencia obligatoria?
            </strong>
            <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5" }}>
              No. Puedes activar o cancelar el Plan PRO en cualquier momento desde esta misma pantalla sin penalizaciones.
            </p>
          </div>
          <div>
            <strong style={{ color: "#fff", display: "block", marginBottom: "4px" }}>
              ¿Qué ocurre con mis obras si vuelvo a Free?
            </strong>
            <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5" }}>
              Tus obras nunca se borran. Se mantendrán guardadas con su historial intacto, pero sólo podrás crear o editar 1 obra activa a la vez.
            </p>
          </div>
          <div>
            <strong style={{ color: "#fff", display: "block", marginBottom: "4px" }}>
              ¿Cómo recibo las facturas oficiales?
            </strong>
            <p className="text-secondary" style={{ margin: 0, lineHeight: "1.5" }}>
              Cada mes se emite una factura con tu CIF/NIF y desglose del 21% de IVA para entregar directamente a tu gestor contable.
            </p>
          </div>
        </div>
      </div>

      {/* Downgrade Confirm Dialog */}
      {showDowngradeConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 300,
          padding: "20px"
        }}>
          <div className="glass-panel slide-up" style={{
            maxWidth: "460px",
            width: "100%",
            padding: "28px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ fontSize: "20px", margin: "0 0 8px 0" }}>¿Seguro que deseas volver al Plan Gratuito?</h3>
            <p className="text-secondary" style={{ fontSize: "14px", lineHeight: "1.5", margin: "0 0 24px 0" }}>
              Perderás la capacidad de gestionar más de 1 obra y cuadrillas ilimitadas. Podrás volver a reactivar PRO cuando lo necesites.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDowngradeConfirm(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: "10px" }}
              >
                Mantener PRO
              </button>
              <button
                onClick={handleDowngrade}
                className="btn-primary"
                style={{ flex: 1, padding: "10px", background: "#ef4444", borderColor: "#ef4444" }}
              >
                Confirmar Bajada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
