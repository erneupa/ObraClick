import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubscriptionClient from "@/components/SubscriptionClient";

export const instant = false;

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: {
          projects: true,
          teamMembers: true,
        },
      },
    },
  });

  const plan = dbUser?.plan || "FREE";
  const trialEndsAt = dbUser?.trialEndsAt ? dbUser.trialEndsAt.toISOString() : null;
  const projectCount = dbUser?._count?.projects || 0;
  const teamCount = dbUser?._count?.teamMembers || 0;

  return (
    <SubscriptionClient
      currentPlan={plan}
      trialEndsAt={trialEndsAt}
      userEmail={session.user.email}
      userName={dbUser?.name || session.user.name || "Usuario"}
      projectCount={projectCount}
      teamCount={teamCount}
    />
  );
}
