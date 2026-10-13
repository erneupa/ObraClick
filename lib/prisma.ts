import { PrismaClient } from "@obraclick-prisma-v3/client";

const globalForPrisma = global as unknown as { 
  obraclickPrismaV3?: PrismaClient; 
  prisma?: any 
};

// Clear any stale cached Prisma client on global
if (globalForPrisma.prisma && !globalForPrisma.obraclickPrismaV3) {
  try {
    delete globalForPrisma.prisma;
  } catch {}
}

export const prisma: PrismaClient =
  globalForPrisma.obraclickPrismaV3 ||
  (() => {
    const client = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.obraclickPrismaV3 = client;
      globalForPrisma.prisma = client;
    }
    return client;
  })();
