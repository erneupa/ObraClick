import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import FinancesClient from "@/components/FinancesClient";

export const instant = false;

export default async function FinanzasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          expenses: true,
        },
      },
    },
  });

  const projects = user?.projects || [];
  
  // Consolidate all expenses with project info
  const allExpenses = projects.flatMap((p) =>
    p.expenses.map((e) => ({
      ...e,
      project: { id: p.id, name: p.name },
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <FinancesClient 
        projects={projects} 
        expenses={allExpenses} 
        totalBudget={totalBudget} 
        totalSpent={totalSpent} 
      />
    </div>
  );
}
