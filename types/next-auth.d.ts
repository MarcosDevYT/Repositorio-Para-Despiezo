import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      phoneNumber?: string | null;
      location?: string | null;
      businessName?: string | null;
      emailVerified?: Date | null;
      phoneVerified?: Date | null;
      createdAt?: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    phoneNumber?: string | null;
    location?: string | null;
    businessName?: string | null;
    emailVerified?: Date | null;
    phoneVerified?: Date | null;
    createdAt?: Date | null;
  }
}
