import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { sendWelcomeEmail } from "./email";

if (process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim().replace(/\/$/, "");
} else if (process.env.RENDER_EXTERNAL_URL) {
  process.env.NEXTAUTH_URL = process.env.RENDER_EXTERNAL_URL.trim().replace(/\/$/, "");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("⚠️ [Auth] GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET no están definidos en las variables de entorno.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor introduce tu email y contraseña");
        }
        const email = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado o registrado con Google");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.plan = (user as any).plan || "FREE";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).plan = token.plan || "FREE";
        if (session.user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: session.user.email },
              select: { plan: true, role: true },
            });
            if (dbUser?.plan) {
              (session.user as any).plan = dbUser.plan;
            }
            if (dbUser?.role) {
              (session.user as any).role = dbUser.role;
            }
          } catch (e) {
            // fallback to token plan
          }
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });
        if (user.email) {
          sendWelcomeEmail(user.email, user.name || "Constructor").catch(() => {});
        }
      } catch (e) {
        console.error("Error setting trialEndsAt on createUser:", e);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
