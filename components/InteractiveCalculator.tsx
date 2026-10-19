"use client";

import { useState } from "react";
import Link from "next/link";

export default function InteractiveCalculator() {
  const [projectsCount, setProjectsCount] = useState(3);
  const [avgBudget, setAvgBudget] = useState(150000);

  // Estimaciones basadas en estudios del sector de la construcción en España:
  // - Ahorro de ~14 horas al mes por obra en papeleo, llamadas y visitas innecesarias
  // - Prevención de desvíos no cobrados de ~3.8% del presupuesto
  // - ~22 partes diarios digitales al mes por obra
  const hoursSavedPerMonth = projectsCount * 14;
  const potentialSavings = Math.round(projectsCount * avgBudget * 0.038);
  const reportsGenerated = projectsCount * 22;

  return (
    <div
      className="glow-card"
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "36px 32px",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div className="badge-live" style={{ marginBottom: "12px" }}>
          <span className="live-dot" />
          <span>SIMULADOR DE IMPACTO ECONÓMICO</span>
        </div>
        <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
          ¿Cuánto tiempo y dinero ahorrarás con CertiObra?
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", margin: 0 }}>
          Mueve los controles según la actividad de tu constructora o estudio para ver el retorno inmediato.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px", marginBottom: "36px" }}>
        {/* Slider 1: Obras Simultáneas */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              Obras o Reformas Activas:
            </label>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--accent-primary)" }}>
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
              height: "6px",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            <span>1 obra</span>
            <span>5 obras</span>
            <span>10 obras</span>
            <span>15 obras</span>
          </div>
        </div>

        {/* Slider 2: Presupuesto Promedio */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              Presupuesto Promedio / Obra:
            </label>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "#10b981" }}>
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
              height: "6px",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            <span>30.000 €</span>
            <span>250.000 €</span>
            <span>500.000 €</span>
            <span>800.000 €</span>
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          background: "rgba(0, 0, 0, 0.4)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "28px",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            ⏱️ Tiempo Recuperado
          </div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#60a5fa" }}>
            {hoursSavedPerMonth}h <span style={{ fontSize: "14px", fontWeight: "500", color: "#94a3b8" }}>/ mes</span>
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Elimina el cuaderno físico y las llamadas
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            💰 Desvíos Evitados
          </div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#34d399" }}>
            ~{potentialSavings.toLocaleString("es-ES")} €
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Control de partidas y gastos en tiempo real
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            📑 Partes Certificados
          </div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#f59e0b" }}>
            {reportsGenerated} <span style={{ fontSize: "14px", fontWeight: "500", color: "#94a3b8" }}>/ mes</span>
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Con fotos, meteorología y firma digital
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          href="/login"
          className="btn-primary"
          style={{
            display: "inline-flex",
            padding: "14px 32px",
            fontSize: "16px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
          }}
        >
          <span>Empezar a Ahorrar en mi Próxima Obra</span>
          <span>🚀</span>
        </Link>
      </div>
    </div>
  );
}
