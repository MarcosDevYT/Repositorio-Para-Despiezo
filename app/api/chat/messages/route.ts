import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { roomId, content } = await request.json();

    // Verificar que el usuario tenga acceso a este chat
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        OR: [{ vendorId: session.user.id }, { buyerId: session.user.id }],
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 }
      );
    }

    // Crear el mensaje
    const message = await prisma.message.create({
      data: {
        roomId,
        senderId: session.user.id,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Error al enviar mensaje" },
      { status: 500 }
    );
  }
}
