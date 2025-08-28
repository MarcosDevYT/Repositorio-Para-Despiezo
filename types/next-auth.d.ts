import { Prisma } from "@prisma/client";
import NextAuth from "next-auth";

// Usamos un "payload" que omite campos sensibles como password/hash
type PrismaUser = Prisma.UserGetPayload<{}>;

declare module "next-auth" {
  interface Session {
    user: PrismaUser;
  }

  interface User extends PrismaUser {}
}
