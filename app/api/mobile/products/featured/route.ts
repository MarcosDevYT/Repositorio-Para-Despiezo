import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const featured = await prisma.product.findMany({
      where: {
        status: "publicado",
        featuredUntil: { gte: new Date() },
      },
      orderBy: { featuredAt: "desc" },
      take: 10,
    });

    const recent = await prisma.product.findMany({
      where: { status: "publicado" },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const popular = await prisma.product.findMany({
      where: { status: "publicado" },
      orderBy: { clicks: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      featured: JSON.parse(JSON.stringify(featured)),
      recent: JSON.parse(JSON.stringify(recent)),
      popular: JSON.parse(JSON.stringify(popular)),
    });
  } catch (error) {
    console.error("Mobile featured error:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
