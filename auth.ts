/**
 * Configuración de NextAuth para autenticación con Google y Prisma Adapter
 * para persistencia de datos en supabase
 * @returns Configuración de NextAuth
 */

import authConfig from "@/auth.config";

import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Configuración de NextAuth
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            email: true,
            emailVerified: true,
            name: true,
            image: true,
            phoneNumber: true,
            phoneVerified: true,
            location: true,
            description: true,
            bussinesCategory: true,
            businessName: true,
            createdAt: true,
            products: true,
          },
        });

        if (user) {
          session.user = {
            ...session.user,
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            name: user.name,
            image: user.image,
            description: user.description,
            bussinesCategory: user.bussinesCategory,
            phoneNumber: user.phoneNumber,
            phoneVerified: user.phoneVerified,
            location: user.location,
            businessName: user.businessName,
            createdAt: user.createdAt,
            products: user.products,
          };
        }
      }

      return session;
    },
  },
});
