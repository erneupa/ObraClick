"use client";

import { useState } from "react";
import Link from "next/link";

export default function InteractiveFeatureTabs() {
  const [activeTab, setActiveTab] = useState<"parte" | "costes" | "certificacion">("parte");
  const [signatureSigned, setSignatureSigned] = useState(false);

  return (
    <div className="feature-tabs-wrapper">
      {/* Tab Switcher Buttons */}
      <div className="feature-tabs-nav" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "parte"}
          onClick={() => setActiveTab("parte")}
          className={`feature-tab-btn ${activeTab === "parte" ? "feature-tab-btn-active" : ""}`}
        >
          <span>📋</span>
          <span className="feature-tab-label-full">Parte Diario con Firma Táctil</span>
          <span className="feature-tab-label-short">Parte Diario</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "costes"}
          onClick={() => setActiveTab("costes")}
          className={`feature-tab-btn ${activeTab === "costes" ? "feature-tab-btn-active" : ""}`}
        >
          <span>💰</span>
          <span className="feature-tab-label-full">Control Presupuestario en Tiempo Real</span>
          <span className="feature-tab-label-short">Control Costes</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "certificacion"}
          onClick={() => setActiveTab("certificacion")}
          className={`feature-tab-btn ${activeTab === "certificacion" ? "feature-tab-btn-active" : ""}`}
        >
          <span>🔒</span>
          <span className="feature-tab-label-full">Certificación Oficial Inmutable</span>
          <span className="feature-tab-label-short">Certificados</span>
        </button>
      </div>

      {/* Main Interactive Screen Showcase */}
      <div className="glow-card feature-tabs-card">
        {/* TAB 1: PARTE DIARIO */}
        {activeTab === "parte" && (
          <div className="feature-tabs-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span className="badge badge-amber">REPLANTEO EN CAMPO</span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>☀️ 22°C Despejado • Madrid</span>
              </div>
              <h4 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "800", color: "#fff", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                Parte Diario Digital: Hormigonado de Forjado 2
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                El jefe de obra registra en 60 segundos el personal activo, la maquinaria utilizada, fotografías con geolocalización y el visado técnico.
              </p>

              <div className="feature-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--surface-border)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Cuadrilla Activa</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>14 Operarios (2 Estructuristas)</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--surface-border)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Hormigón Vertido</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#34d399" }}>42 m³ HA-30 (Conforme)</div>
                </div>
              </div>

              <div className="feature-actions-row">
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
            <div className="feature-mockup-box" style={{ border: "1px solid rgba(59, 130, 246, 0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#fff" }}>CertiObra · Parte #084</span>
                <span className="badge-live" style={{ fontSize: "11px", padding: "3px 8px" }}>
                  <span className="live-dot" />
                  VALIDADO
                </span>
              </div>
              <div style={{ height: "100px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
                <span style={{ fontSize: "26px" }}>📸</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Foto avance sellada: 18/10/2026 11:42</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--surface-border)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>Firma Digital del Jefe de Obra</div>
                <div style={{ minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", color: signatureSigned ? "#34d399" : "#64748b", fontWeight: "700", fontSize: "15px", wordBreak: "break-word" }}>
                  {signatureSigned ? "Carlos Gómez · DNI 48***92X" : "Pendiente de firma (Haz clic en el botón)"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COSTES */}
        {activeTab === "costes" && (
          <div className="feature-tabs-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span className="badge badge-amber">DETECCIÓN DE DESVIACIONES</span>
                <span style={{ fontSize: "12px", color: "#34d399" }}>Margen Protegido: 18.4%</span>
              </div>
              <h4 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "800", color: "#fff", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                Control Presupuestario en Tiempo Real
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                No esperes al final del mes para saber si una partida se ha disparado. CertiObra compara cada albarán imputado frente a la contrata inicial y te avisa antes de que comience el sobrecoste.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ color: "#fff" }}>Estructura y Cimentación</span>
                    <span style={{ color: "#34d399", fontWeight: "700" }}>94% ejecutado (En rango)</span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: "94%", height: "100%", background: "#10b981" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px", flexWrap: "wrap", gap: "4px" }}>
                    <span style={{ color: "#fff" }}>Instalaciones Clima / Fontanería</span>
                    <span style={{ color: "#f59e0b", fontWeight: "700" }}>+2.4% extra aprobado</span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "#f59e0b" }} />
                  </div>
                </div>
              </div>

              <div className="feature-actions-row">
                <Link href="/login" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>
                  Probar Control Financiero Gratis →
                </Link>
              </div>
            </div>

            {/* Mockup Card */}
            <div className="feature-mockup-box" style={{ border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "center" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Presupuesto Total Proyecto
              </div>
              <div style={{ fontSize: "clamp(26px, 6vw, 36px)", fontWeight: "900", color: "#fff", marginBottom: "14px" }}>
                245.000 €
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px", textAlign: "left" }}>
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

        {/* TAB 3: CERTIFICACION */}
        {activeTab === "certificacion" && (
          <div className="feature-tabs-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span className="badge badge-amber">VALIDEZ OFICIAL</span>
                <span style={{ fontSize: "12px", color: "#93c5fd" }}>Exportación PDF en 1 Clic</span>
              </div>
              <h4 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "800", color: "#fff", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                Certificación Oficial para Clientes y Bancos
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                Genera expedientes completos con numeración oficial, sellado cronológico y firmas inmutables. Imprescindible para liberar certificaciones bancarias y justificar avances ante promotores.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <span style={{ color: "#10b981", fontSize: "16px", flexShrink: 0 }}>✓</span>
                  <span>Sin marcas de agua en el Plan PRO (sello oficial de tu empresa).</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <span style={{ color: "#10b981", fontSize: "16px", flexShrink: 0 }}>✓</span>
                  <span>Código de verificación y trazabilidad técnica frente a reclamaciones.</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <span style={{ color: "#10b981", fontSize: "16px", flexShrink: 0 }}>✓</span>
                  <span>Portal privado con enlace para el promotor sin exponer costes internos.</span>
                </div>
              </div>

              <div className="feature-actions-row">
                <Link href="/login" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>
                  Ver Ejemplo de Certificación →
                </Link>
              </div>
            </div>

            {/* PDF Mockup Card */}
            <div
              className="feature-mockup-box"
              style={{
                background: "#ffffff",
                color: "#0f172a",
                border: "2px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #3b82f6", paddingBottom: "10px", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "#1d4ed8" }}>🏗️ CERTIOBRA</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>CERTIFICACIÓN OFICIAL DE OBRA #CERT-2026-09</div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
                  VERIFICADO
                </div>
              </div>
              <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                <strong>Proyecto:</strong> Residencial Los Álamos · Fase II
              </div>
              <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                <strong>Dirección:</strong> Estudio Gómez & Asoc.
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "12px 0 6px" }}>
                Importe Certificado: 184.250,00 €
              </div>
              <div style={{ fontSize: "10px", color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
                Sello temporal de inmutabilidad · SHA-256 verificado
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
