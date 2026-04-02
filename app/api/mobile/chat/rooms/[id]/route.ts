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

// GET - Get a specific chat room with all messages
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const room = await prisma.room.findFirst({
      where: {
        id,
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
          include: {
            sender: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      room: JSON.parse(JSON.stringify(room)),
    });
  } catch (error) {
    console.error("Mobile chat room detail error:", error);
    return NextResponse.json({ error: "Error al obtener el chat" }, { status: 500 });
  }
}
