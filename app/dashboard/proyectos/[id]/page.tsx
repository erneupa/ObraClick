import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProjectDetailsClient from "@/components/ProjectDetailsClient";

export const instant = false;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const [user, project] = await Promise.all([
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { plan: true, trialEndsAt: true },
    }),
    prisma.project.findFirst({
      where: { 
        id,
        user: { email: session.user.email },
      },
      include: {
        milestones: { orderBy: { order: "asc" } },
        dailyReports: { orderBy: { createdAt: "desc" } },
        incidents: { orderBy: { createdAt: "desc" } },
        expenses: { orderBy: { date: "desc" } },
      },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link 
          href="/dashboard/proyectos" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            color: "var(--text-secondary)", 
            fontSize: "14px",
            textDecoration: "none"
          }}
        >
          ← Volver al listado de obras
        </Link>
      </div>

      <ProjectDetailsClient 
        project={project} 
        userPlan={user?.plan || "FREE"}
        trialEndsAt={user?.trialEndsAt ? user.trialEndsAt.toISOString() : null}
      />
    </div>
  );
}
