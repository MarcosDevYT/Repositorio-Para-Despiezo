/**
 * Configuración de NextAuth para autenticación con Google y Prisma Adapter
 * para persistencia de datos en supabase
 * @returns Configuración de NextAuth
 */

import authConfig from "@/auth.config";

import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { stripe } from "./lib/stripe";

// Configuración de NextAuth
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, concatenar con la baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Si la URL ya es de la misma base, permitirla
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
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
            businessBannerUrl: true,
            businessName: true,
            averageRating: true,
            totalReviews: true,
            createdAt: true,
            products: {
              select: {
                id: true,
                status: true,
                name: true,
              },
            },
            addresses: true,
            connectedAccountId: true,
            stripeConnectedLinked: true,
            pro: true,
            priceId: true,
            customerId: true,
            subscriptionId: true,
          },
        });

        if (user) {
          if (!user.connectedAccountId && user.connectedAccountId === null) {
            const account = await stripe.accounts.create({
              email: user.email,
              controller: {
                losses: {
                  payments: "application",
                },
                fees: {
                  payer: "application",
                },
                stripe_dashboard: {
                  type: "express",
                },
              },
            });

            await prisma.user.update({
              where: { id: user.id },
              data: {
                connectedAccountId: account.id,
              },
            });
          }

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
            businessBannerUrl: user.businessBannerUrl,
            createdAt: user.createdAt,
            products: user.products,
            averageRating: user.averageRating,
            totalReviews: user.totalReviews,
            addresses: user.addresses,
            connectedAccountId: user.connectedAccountId,
            stripeConnectedLinked: user.stripeConnectedLinked,
            pro: user.pro,
            priceId: user.priceId,
            customerId: user.customerId,
            subscriptionId: user.subscriptionId,
          };
        }
      }

      return session;
    },
  },
});
