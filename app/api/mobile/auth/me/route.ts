import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "secret");

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      include: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
