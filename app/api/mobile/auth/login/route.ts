import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "secret");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { addresses: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

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
        description: user.description,
        phoneNumber: user.phoneNumber,
        location: user.location,
        businessName: user.businessName,
        businessBannerUrl: user.businessBannerUrl,
        bussinesCategory: user.bussinesCategory,
        averageRating: user.averageRating,
        totalReviews: user.totalReviews,
        emailVerified: user.emailVerified,
        pro: user.pro,
        stripeConnectedLinked: user.stripeConnectedLinked,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Mobile login error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
