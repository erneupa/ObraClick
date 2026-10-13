import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let plan = "FREE";
  let trialEndsAt: string | null = null;
  let projectCount = 0;
  if (session?.user?.email) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          plan: true,
          trialEndsAt: true,
          _count: {
            select: { projects: true }
          }
        }
      });
      if (dbUser) {
        plan = dbUser.plan || "FREE";
        if (!dbUser.trialEndsAt && plan !== "PRO" && plan !== "ENTERPRISE") {
          const autoTrial = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { trialEndsAt: autoTrial },
          });
          trialEndsAt = autoTrial.toISOString();
        } else {
          trialEndsAt = dbUser.trialEndsAt ? dbUser.trialEndsAt.toISOString() : null;
        }
        projectCount = dbUser._count?.projects || 0;
      }
    } catch (e) {
      // fallback to FREE
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <DashboardSidebar plan={plan} projectCount={projectCount} trialEndsAt={trialEndsAt} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <DashboardHeader plan={plan} trialEndsAt={trialEndsAt} />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px", background: "var(--background-color)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
