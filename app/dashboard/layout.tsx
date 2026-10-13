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
    <div className="dashboard-container">
      <DashboardSidebar plan={plan} projectCount={projectCount} trialEndsAt={trialEndsAt} />
      <div className="dashboard-main-area">
        <DashboardHeader plan={plan} trialEndsAt={trialEndsAt} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
