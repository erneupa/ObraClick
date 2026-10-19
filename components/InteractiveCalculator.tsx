"use client";

import { useState } from "react";
import Link from "next/link";

export default function InteractiveCalculator() {
  const [projectsCount, setProjectsCount] = useState(3);
  const [avgBudget, setAvgBudget] = useState(150000);

  // Estimaciones del sector de la construcción en España:
  // - Ahorro de ~14 horas al mes por obra en papeleo y llamadas
  // - Prevención de desvíos no cobrados de ~3.8% del presupuesto
  // - ~22 partes diarios digitales al mes por obra
  const hoursSavedPerMonth = projectsCount * 14;
  const potentialSavings = Math.round(projectsCount * avgBudget * 0.038);
  const reportsGenerated = projectsCount * 22;

  return (
    <div className="glow-card calc-card">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div className="badge-live" style={{ marginBottom: "12px" }}>
          <span className="live-dot" />
          <span>SIMULADOR DE IMPACTO ECONÓMICO</span>
        </div>
        <h3 style={{ fontSize: "clamp(20px, 4.5vw, 28px)", fontWeight: "800", color: "#fff", margin: "0 0 10px 0", letterSpacing: "-0.5px", lineHeight: "1.25" }}>
          ¿Cuánto tiempo y dinero ahorrarás con CertiObra?
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "clamp(13px, 2.5vw, 15px)", margin: 0, maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          Mueve los controles según la actividad de tu constructora o estudio para ver el retorno inmediato.
        </p>
      </div>

      {/* Sliders Grid */}
      <div className="calc-sliders-grid">
        {/* Slider 1: Obras Simultáneas */}
        <div className="calc-slider-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              Obras o Reformas Activas:
            </label>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--accent-primary)" }}>
              {projectsCount} {projectsCount === 1 ? "obra" : "obras"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={projectsCount}
            onChange={(e) => setProjectsCount(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#3b82f6",
              cursor: "pointer",
              height: "8px",
            }}
            aria-label="Número de obras activas"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "8px" }}>
            <span>1 obra</span>
            <span className="calc-tick-desktop">5 obras</span>
            <span className="calc-tick-desktop">10 obras</span>
            <span>15 obras</span>
          </div>
        </div>

        {/* Slider 2: Presupuesto Promedio */}
        <div className="calc-slider-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              Presupuesto Promedio / Obra:
            </label>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#10b981" }}>
              {avgBudget.toLocaleString("es-ES")} €
            </span>
          </div>
          <input
            type="range"
            min="30000"
            max="800000"
            step="10000"
            value={avgBudget}
            onChange={(e) => setAvgBudget(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#10b981",
              cursor: "pointer",
              height: "8px",
            }}
            aria-label="Presupuesto promedio por obra"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "8px" }}>
            <span>30.000 €</span>
            <span className="calc-tick-desktop">250.000 €</span>
            <span className="calc-tick-desktop">500.000 €</span>
            <span>800.000 €</span>
          </div>
        </div>
      </div>

      {/* Results Dashboard Grid */}
      <div className="calc-results-grid">
        <div className="calc-stat-card">
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            ⏱️ Tiempo Recuperado
          </div>
          <div style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "900", color: "#60a5fa" }}>
            {hoursSavedPerMonth}h <span style={{ fontSize: "14px", fontWeight: "500", color: "#94a3b8" }}>/ mes</span>
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Elimina el cuaderno físico y llamadas innecesarias
          </div>
        </div>

        <div className="calc-stat-card">
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            💰 Desvíos Evitados
          </div>
          <div style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "900", color: "#34d399" }}>
            ~{potentialSavings.toLocaleString("es-ES")} €
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Control de partidas y gastos en tiempo real
          </div>
        </div>

        <div className="calc-stat-card">
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            📑 Partes Certificados
          </div>
          <div style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "900", color: "#f59e0b" }}>
            {reportsGenerated} <span style={{ fontSize: "14px", fontWeight: "500", color: "#94a3b8" }}>/ mes</span>
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Con fotos, meteorología y firma digital inmutable
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: "center" }}>
        <Link
          href="/login"
          className="btn-primary"
          style={{
            padding: "14px 28px",
            fontSize: "15px",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "420px",
          }}
          id="btn-calc-cta"
        >
          <span>Empezar a Ahorrar en mi Próxima Obra</span>
          <span>🚀</span>
        </Link>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>
          Prueba gratuita de 14 días • Sin permanencia • Configuración en 2 minutos
        </div>
      </div>
    </div>
  );
}
