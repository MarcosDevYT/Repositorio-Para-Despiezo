/**
 * Exportar la configuración de NextAuth para autenticación con Google y Prisma Adapter
 * @returns Configuración de NextAuth
 */

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/zodSchemas/authSchema";
import { prisma } from "./lib/prisma";

export default {
  providers: [
    Google,
    Credentials({
      authorize: async (credentials) => {
        const { success, data } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales inválidas");
        }

        // Verificamos si el usuario existe en la base de datos
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
          include: {
            addresses: true,
            products: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        // Verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
