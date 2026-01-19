"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PrismaOrden } from "@/types/ProductTypes";
import { redirect } from "next/navigation";

// Funcion para iniciar un chat con un vendedor
export const startChatAction = async (productId: string) => {
  try {
    // Conseguimos la session del usuario
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    // Conseguimos el producto
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    // obtenemos el usuario y vendedor
    const userId = session.user.id;
    const vendorId = product.vendorId;

    // Verificamos que el vendedor no sea el mismo usuario
    if (userId === vendorId) {
      return { success: false, error: "No puedes chatear contigo mismo" };
    }

    // verificamos que existaa un chat
    let room = await prisma.room.findFirst({
      where: { productId, vendorId, buyerId: userId },
    });

    // Si no hay chat creamos uno
    if (!room) {
      room = await prisma.room.create({
        data: { productId, vendorId, buyerId: userId },
      });
    }

    return { success: true, url: `/inbox/${room.id}` };
  } catch (err) {
    console.error("Error starting chat:", err);
    return { success: false, error: "Error al crear chat" };
  }
};

/**
 * Función para iniciar un chat con un cliente desde la perspectiva del vendedor
 */
export const startChatWithClient = async (orden: PrismaOrden) => {
  try {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const vendorId = session.user.id;
    const buyerId = orden.buyer.id;

    if (vendorId === buyerId) {
      return { success: false, error: "No puedes chatear contigo mismo" };
    }

    // Revisamos si ya existe un chat con alguno de los productos
    let room;
    for (const item of orden.items) {
      room = await prisma.room.findFirst({
        where: {
          productId: item.product.id,
          vendorId,
          buyerId,
        },
      });
      if (room) break; // usamos el primer chat existente
    }

    // Si no hay ninguno, creamos con el primer producto
    if (!room) {
      const firstProductId = orden.items[0].product.id;
      room = await prisma.room.create({
        data: { productId: firstProductId, vendorId, buyerId },
      });
    }

    return { success: true, url: `/inbox/${room.id}` };
  } catch (err) {
    console.error("Error starting chat:", err);
    return { success: false, error: "Error al crear chat" };
  }
};

/**
 * Obtiene el chat con sus mensajes y datos del vendedor y comprador
 * @param roomId ID del chat
 * @returns Chat con sus mensajes y datos del vendedor y comprador
 */
export const getChatRoomAction = async (roomId: string) => {
  try {
    // Verificar que el usuario este autenticado
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("No autenticado");
    }

    // Verificar que el usuario tenga acceso a este chat
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        OR: [{ vendorId: session.user.id }, { buyerId: session.user.id }],
      },
      include: {
        product: {},
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!room) {
      throw new Error("Chat no encontrado");
    }

    return { room: room, success: true };
  } catch (error) {
    console.error("Error al obtener el chat:", error);
    return { success: false, error: "Error al obtener el chat" };
  }
};

/**
 * Obtiene todos los chats del usuario
 * @param userId ID del usuario
 * @returns Chats del usuario
 */
export const getChats = async () => {
  try {
    // Verificar que el usuario este autenticado
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("No autenticado");
    }

    // Verificar que el usuario tenga acceso a este chat
    const chats = await prisma.room.findMany({
      where: {
        OR: [{ vendorId: session.user.id }, { buyerId: session.user.id }],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!chats) {
      throw new Error("Chat no encontrado");
    }

    return { chats: chats, success: true };
  } catch (error) {
    console.error("Error al obtener el chat:", error);
    return { success: false, error: "Error al obtener el chat" };
  }
};
