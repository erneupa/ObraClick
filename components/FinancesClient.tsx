"use client";

import { useState } from "react";
import { addExpense } from "@/lib/actions";

interface FinancesClientProps {
  projects: any[];
  expenses: any[];
  totalBudget: number;
  totalSpent: number;
}

export default function FinancesClient({ projects, expenses, totalBudget, totalSpent }: FinancesClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("TODOS");
  const [projectFilter, setProjectFilter] = useState("TODOS");

  function exportToCSV() {
    if (filteredExpenses.length === 0) {
      alert("No hay gastos para exportar con los filtros actuales");
      return;
    }

    const headers = ["Fecha", "Obra", "Concepto", "Categoría", "Proveedor / Subcontrata", "Estado", "Importe (€)"];
    const rows = filteredExpenses.map((e) => [
      new Date(e.date).toLocaleDateString("es-ES"),
      `"${(e.project?.name || "Obra").replace(/"/g, '""')}"`,
      `"${e.concept.replace(/"/g, '""')}"`,
      `"${e.category.replace(/"/g, '""')}"`,
      `"${(e.supplier || "-").replace(/"/g, '""')}"`,
      `"${e.status.replace(/"/g, '""')}"`,
      e.amount.toFixed(2).replace(".", ","),
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ObraClick_Gastos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addExpense(formData);
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert("Error al registrar el gasto");
    } finally {
      setLoading(false);
    }
  }

  // Calculate breakdown by category
  const categories = [
    { key: "MATERIALES", label: "Materiales", icon: "🧱", color: "#3b82f6" },
    { key: "MANO_DE_OBRA", label: "Mano de Obra", icon: "👷", color: "#10b981" },
    { key: "MAQUINARIA", label: "Maquinaria", icon: "🚜", color: "#f59e0b" },
    { key: "SUBCONTRATAS", label: "Subcontratas", icon: "🤝", color: "#a855f7" },
    { key: "OTROS", label: "Otros", icon: "📦", color: "#ec4899" },
  ];

  const categoryTotals = categories.map((cat) => {
    const total = expenses
      .filter((e) => (projectFilter === "TODOS" || e.projectId === projectFilter) && e.category === cat.key)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, total };
  });

  const filteredExpenses = expenses.filter((e) => {
    const matchCategory = categoryFilter === "TODOS" || e.category === categoryFilter;
    const matchProject = projectFilter === "TODOS" || e.projectId === projectFilter;
    return matchCategory && matchProject;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Control Financiero y Presupuestos
          </h1>
          <p className="text-secondary" style={{ margin: 0, fontSize: "15px" }}>
            Consolidado global de ingresos, costes previstos, certificaciones y albaranes.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={exportToCSV}
            className="btn-secondary"
            title="Descargar datos en formato CSV compatible con Excel"
            style={{ padding: "10px 18px", fontSize: "14px", gap: "8px" }}
          >
            <span>📊</span>
            <span>Exportar Excel / CSV</span>
          </button>
          {projects.length > 0 && (
            <button 
              onClick={() => setIsOpen(true)}
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "14px" }}
            >
              <span>+</span>
              <span>Registrar Movimiento</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Financial Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Presupuesto Total Contratado</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#60a5fa" }}>
            {totalBudget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Gasto Real Ejecutado</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981" }}>
            {totalSpent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Margen Disponible</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: totalBudget - totalSpent >= 0 ? "#fff" : "#f87171" }}>
            {(totalBudget - totalSpent).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>% Presupuesto Consumido</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b" }}>
            {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}%` : "0%"}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ fontSize: "18px", margin: 0, fontWeight: "700" }}>Desglose por Partidas</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Filtrar por obra:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                border: "1px solid var(--surface-border)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="TODOS">Todas las obras ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {categoryTotals.map((cat) => (
            <div 
              key={cat.key}
              onClick={() => setCategoryFilter(categoryFilter === cat.key ? "TODOS" : cat.key)}
              className="glass-panel"
              style={{
                padding: "16px",
                cursor: "pointer",
                border: categoryFilter === cat.key ? `2px solid ${cat.color}` : "1px solid var(--surface-border)",
                background: categoryFilter === cat.key ? "rgba(255,255,255,0.08)" : "var(--glass-bg)",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>{cat.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>{cat.label}</span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>
                {cat.total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", margin: 0, fontWeight: "700" }}>
            Historial de Gastos y Facturas ({filteredExpenses.length})
          </h2>
          {categoryFilter !== "TODOS" && (
            <button 
              onClick={() => setCategoryFilter("TODOS")}
              style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: "600" }}
            >
              Mostrar todos
            </button>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="glass-panel" style={{ padding: "48px 32px", textAlign: "center", color: "var(--text-secondary)" }}>
            No hay movimientos registrados para esta categoría.
          </div>
        ) : (
          <div className="glass-panel table-responsive" style={{ padding: "20px" }}>
            <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Fecha</th>
                  <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Obra Asociada</th>
                  <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Concepto</th>
                  <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Categoría</th>
                  <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Proveedor</th>
                  <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Estado</th>
                  <th style={{ padding: "12px", color: "var(--text-secondary)", textAlign: "right" }}>Importe</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {new Date(e.date).toLocaleDateString("es-ES")}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "600", color: "#60a5fa" }}>
                      {e.project?.name || "Obra"}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "600", color: "#fff" }}>
                      {e.concept}
                    </td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                      {e.category}
                    </td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                      {e.supplier || "-"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "700", color: "#fff" }}>
                      {e.amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Registrar Gasto */}
      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-panel slide-up" style={{
            maxWidth: "520px",
            width: "100%",
            padding: "32px",
            background: "#0f172a"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "20px" }}>Registrar Movimiento Financiero</h2>
              <button onClick={() => setIsOpen(false)} style={{ color: "var(--text-secondary)", fontSize: "20px" }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Obra Asociada *</label>
                <select 
                  name="projectId" 
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none" }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Concepto del Gasto *</label>
                <input 
                  type="text" 
                  name="concept" 
                  required 
                  placeholder="Ej: Acero corrugado B500S 12mm"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Importe (€) *</label>
                  <input 
                    type="number" 
                    name="amount" 
                    required 
                    step="0.01" 
                    placeholder="2450.00"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Categoría</label>
                  <select 
                    name="category" 
                    defaultValue="MATERIALES"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none" }}
                  >
                    <option value="MATERIALES">Materiales</option>
                    <option value="MANO_DE_OBRA">Mano de Obra</option>
                    <option value="MAQUINARIA">Maquinaria</option>
                    <option value="SUBCONTRATAS">Subcontratas</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Proveedor</label>
                  <input 
                    type="text" 
                    name="supplier" 
                    placeholder="Ej: Hierros y Aceros S.L."
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Nº Factura / Albarán</label>
                  <input 
                    type="text" 
                    name="invoiceNumber" 
                    placeholder="F-2026-084"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                  style={{ padding: "10px 20px" }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  {loading ? "Guardando..." : "Guardar Gasto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
