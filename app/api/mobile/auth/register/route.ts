import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { stripe } from "@/lib/stripe";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "secret");

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const account = await stripe.accounts.create({
      email,
      controller: {
        losses: { payments: "application" },
        fees: { payer: "application" },
        stripe_dashboard: { type: "express" },
      },
    });

    const user = await prisma.user.create({
      data: { name, email, password: passwordHash, connectedAccountId: account.id },
    });

    const token = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(secret);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        pro: user.pro,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Mobile register error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
