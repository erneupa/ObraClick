"use client";

import { useState } from "react";
import Link from "next/link";

export default function InteractiveFeatureTabs() {
  const [activeTab, setActiveTab] = useState<"parte" | "costes" | "certificacion">("parte");
  const [signatureSigned, setSignatureSigned] = useState(false);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* Tab Switcher Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("parte")}
          style={{
            padding: "12px 24px",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            background: activeTab === "parte" ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "rgba(255, 255, 255, 0.05)",
            color: activeTab === "parte" ? "#fff" : "var(--text-secondary)",
            border: activeTab === "parte" ? "1px solid rgba(59, 130, 246, 0.6)" : "1px solid var(--surface-border)",
            boxShadow: activeTab === "parte" ? "0 8px 25px rgba(59, 130, 246, 0.4)" : "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>📋</span>
          <span>Parte Diario con Firma Táctil</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("costes")}
          style={{
            padding: "12px 24px",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            background: activeTab === "costes" ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "rgba(255, 255, 255, 0.05)",
            color: activeTab === "costes" ? "#fff" : "var(--text-secondary)",
            border: activeTab === "costes" ? "1px solid rgba(59, 130, 246, 0.6)" : "1px solid var(--surface-border)",
            boxShadow: activeTab === "costes" ? "0 8px 25px rgba(59, 130, 246, 0.4)" : "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>💰</span>
          <span>Control Presupuestario en Tiempo Real</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certificacion")}
          style={{
            padding: "12px 24px",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            background: activeTab === "certificacion" ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "rgba(255, 255, 255, 0.05)",
            color: activeTab === "certificacion" ? "#fff" : "var(--text-secondary)",
            border: activeTab === "certificacion" ? "1px solid rgba(59, 130, 246, 0.6)" : "1px solid var(--surface-border)",
            boxShadow: activeTab === "certificacion" ? "0 8px 25px rgba(59, 130, 246, 0.4)" : "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🔒</span>
          <span>Certificación Oficial Inmutable</span>
        </button>
      </div>

      {/* Main Interactive Screen Showcase */}
      <div
        className="glow-card"
        style={{
          padding: "36px",
          background: "linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          minHeight: "420px",
        }}
      >
        {activeTab === "parte" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span className="badge badge-amber">REPLANTEO EN CAMPO</span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>☀️ 22°C Despejado • Madrid</span>
              </div>
              <h4 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: "0 0 12px 0" }}>
                Parte Diario Digital: Hormigonado de Forjado 2
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                El jefe de obra registra en 60 segundos el personal activo, la maquinaria utilizada, fotografías con geolocalización y el visado técnico.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--surface-border)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Cuadrilla Activa</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>14 Operarios (2 Estructuristas)</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--surface-border)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Hormigón Vertido</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#34d399" }}>42 m³ HA-30 (Conforme)</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setSignatureSigned(!signatureSigned)}
                  className="btn-primary"
                  style={{ padding: "10px 20px", fontSize: "14px" }}
                >
                  {signatureSigned ? "✓ Firma Registrada" : "✍️ Probar Firma Digital"}
                </button>
                <Link href="/login" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "14px" }}>
                  Ver en mi obra →
                </Link>
              </div>
            </div>

            {/* Interactive Live Card Mockup */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#fff" }}>CertiObra · Parte #084</span>
                <span className="badge-live" style={{ fontSize: "11px", padding: "3px 8px" }}>
                  <span className="live-dot" />
                  VALIDADO
                </span>
              </div>
              <div style={{ height: "110px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
                <span style={{ fontSize: "28px" }}>📸</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Foto avance sellada: 18/10/2026 11:42</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--surface-border)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>Firma Digital del Jefe de Obra</div>
                <div style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", color: signatureSigned ? "#34d399" : "#64748b", fontWeight: "700", fontSize: "18px" }}>
                  {signatureSigned ? "Carlos Gómez · DNI 48***92X" : "Pendiente de firma (Haz clic arriba)"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "costes" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span className="badge badge-amber">DETECCIÓN DE DESVIACIONES</span>
                <span style={{ fontSize: "12px", color: "#34d399" }}>Margen Protegido: 18.4%</span>
              </div>
              <h4 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: "0 0 12px 0" }}>
                Control Presupuestario en Tiempo Real
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                No esperes al final del mes para saber si una partida se ha disparado. CertiObra compara cada albarán imputado frente a la contrata inicial y te avisa antes de que comience el sobrecoste.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#fff" }}>Estructura y Cimentación</span>
                    <span style={{ color: "#34d399", fontWeight: "700" }}>94% ejecutado (En rango)</span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: "94%", height: "100%", background: "#10b981" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#fff" }}>Instalaciones Clima / Fontanería</span>
                    <span style={{ color: "#f59e0b", fontWeight: "700" }}>+2.4% extra aprobado</span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: "102%", height: "100%", background: "#f59e0b" }} />
                  </div>
                </div>
              </div>

              <Link href="/login" className="btn-primary" style={{ display: "inline-flex", padding: "10px 24px", fontSize: "14px" }}>
                Probar Control Financiero Gratis →
              </Link>
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Presupuesto Total Proyecto
              </div>
              <div style={{ fontSize: "36px", fontWeight: "900", color: "#fff", marginBottom: "14px" }}>
                245.000 €
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "left" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>Total Imputado</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#60a5fa" }}>142.300 €</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>Saldo Disponible</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#34d399" }}>102.700 €</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "certificacion" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span className="badge badge-amber">VALIDEZ OFICIAL</span>
                <span style={{ fontSize: "12px", color: "#93c5fd" }}>Exportación PDF en 1 Clic</span>
              </div>
              <h4 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: "0 0 12px 0" }}>
                Certificación Oficial para Clientes y Bancos
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                Genera expedientes completos con numeración oficial, sellado cronológico y firmas inmutables. Imprescindible para liberar certificaciones bancarias y justificar avances ante promotores.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
                  <span>Sin marcas de agua en el Plan PRO (sello oficial de tu empresa).</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
                  <span>Código de verificación y trazabilidad técnica frente a reclamaciones.</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
                  <span>Portal privado con enlace para el promotor sin exponer costes internos.</span>
                </div>
              </div>

              <Link href="/login" className="btn-primary" style={{ display: "inline-flex", padding: "10px 24px", fontSize: "14px" }}>
                Ver Ejemplo de Certificación →
              </Link>
            </div>

            <div
              style={{
                background: "#ffffff",
                color: "#0f172a",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                border: "2px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #3b82f6", paddingBottom: "10px", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "#1d4ed8" }}>🏗️ CERTIOBRA</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>CERTIFICACIÓN OFICIAL DE OBRA #CERT-2026-09</div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
                  VERIFICADO
                </div>
              </div>
              <div style={{ fontSize: "12px", marginBottom: "8px" }}>
                <strong>Proyecto:</strong> Residencial Los Álamos · Fase II
              </div>
              <div style={{ fontSize: "12px", marginBottom: "8px" }}>
                <strong>Dirección Facultativa:</strong> Estudio Gómez & Asoc.
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "14px 0 6px" }}>
                Importe Certificado a Origen: 184.250,00 €
              </div>
              <div style={{ fontSize: "10px", color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
                Sello temporal de inmutabilidad · SHA-256 verificado por CertiObra
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
