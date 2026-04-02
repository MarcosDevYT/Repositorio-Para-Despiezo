import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "secret");

async function getUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, secret);
    return payload.sub as string;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: {
        status: "publicado",
        favorites: { some: { userId } },
      },
    });

    return NextResponse.json({
      success: true,
      products: JSON.parse(JSON.stringify(products)),
    });
  } catch (error) {
    console.error("Mobile favorites error:", error);
    return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId es requerido" }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { userId_productId: { userId, productId } } });
      return NextResponse.json({ success: true, isFavorite: false });
    } else {
      await prisma.favorite.create({ data: { userId, productId } });
      return NextResponse.json({ success: true, isFavorite: true });
    }
  } catch (error) {
    console.error("Mobile toggle favorite error:", error);
    return NextResponse.json({ error: "Error al cambiar favorito" }, { status: 500 });
  }
}
