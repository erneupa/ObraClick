import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectsListClient from "@/components/ProjectsListClient";

export const instant = false;

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  let projects: any[] = [];
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          include: {
            milestones: true,
            expenses: true,
            incidents: true,
            dailyReports: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    projects = user?.projects || [];
  }

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Gestión de Obras y Proyectos
          </h1>
          <p className="text-secondary" style={{ margin: 0, fontSize: "15px" }}>
            Supervisa el avance físico, financiero e incidencias de todas tus construcciones en curso.
          </p>
        </div>
        <CreateProjectModal />
      </header>

      {/* Quick Summary Bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "28px"
      }}>
        <div className="glass-panel" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Total Obras</div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#fff" }}>{projects.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Presupuesto Global</div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#60a5fa" }}>
            {totalBudget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Inversión Ejecutada</div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#10b981" }}>
            {totalSpent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Margen Disponible</div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: totalBudget - totalSpent >= 0 ? "#fff" : "#f87171" }}>
            {(totalBudget - totalSpent).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>
      </div>

      {/* Projects Grid with Search/Filter */}
      {projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: "64px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏗️</div>
          <h2 style={{ fontSize: "22px", margin: "0 0 10px 0" }}>No hay proyectos creados todavía</h2>
          <p className="text-secondary" style={{ maxWidth: "460px", margin: "0 auto 28px", fontSize: "15px" }}>
            Crea tu primera obra para comenzar a registrar partes diarios, subir planos, asignar hitos y controlar los gastos.
          </p>
          <CreateProjectModal />
        </div>
      ) : (
        <ProjectsListClient projects={JSON.parse(JSON.stringify(projects))} />
      )}
    </div>
  );
}
