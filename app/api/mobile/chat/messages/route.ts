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

// POST - Send a message in a chat room
export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { roomId, content } = await req.json();
    if (!roomId || !content) {
      return NextResponse.json({ error: "roomId y content son requeridos" }, { status: 400 });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        OR: [{ vendorId: userId }, { buyerId: userId }],
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: { roomId, senderId: userId, content },
      include: {
        sender: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: JSON.parse(JSON.stringify(message)),
    });
  } catch (error) {
    console.error("Mobile send message error:", error);
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 });
  }
}
