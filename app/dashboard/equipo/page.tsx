import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeamClient from "@/components/TeamClient";

export const instant = false;

export default async function EquipoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      teamMembers: { orderBy: { createdAt: "desc" } },
    },
  });

  const members = user?.teamMembers || [];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <TeamClient initialMembers={members} />
    </div>
  );
}
