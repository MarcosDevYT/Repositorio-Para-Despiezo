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

// GET - List all chat rooms for the authenticated user
export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const chats = await prisma.room.findMany({
      where: {
        OR: [{ vendorId: userId }, { buyerId: userId }],
      },
      include: {
        product: {
          select: { id: true, name: true, images: true, price: true },
        },
        vendor: {
          select: { id: true, name: true, email: true, image: true },
        },
        buyer: {
          select: { id: true, name: true, email: true, image: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, content: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      chats: JSON.parse(JSON.stringify(chats)),
    });
  } catch (error) {
    console.error("Mobile chat rooms error:", error);
    return NextResponse.json({ error: "Error al obtener chats" }, { status: 500 });
  }
}

// POST - Start a new chat room (or return existing one)
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

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (userId === product.vendorId) {
      return NextResponse.json({ error: "No puedes chatear contigo mismo" }, { status: 400 });
    }

    let room = await prisma.room.findFirst({
      where: { productId, vendorId: product.vendorId, buyerId: userId },
    });

    if (!room) {
      room = await prisma.room.create({
        data: { productId, vendorId: product.vendorId, buyerId: userId },
      });
    }

    return NextResponse.json({ success: true, roomId: room.id });
  } catch (error) {
    console.error("Mobile start chat error:", error);
    return NextResponse.json({ error: "Error al crear chat" }, { status: 500 });
  }
}
