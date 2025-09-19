"use server";

import { prisma } from "@/lib/prisma";

/**
 * Funcion para obtener ordenes con paginacion
 */
export async function getOrders(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [ordenes, total] = await Promise.all([
      prisma.orden.findMany({
        include: {
          buyer: true,
          vendor: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // opcional
      }),
      prisma.orden.count(),
    ]);

    return {
      ordenes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(error);
    return {
      ordenes: [],
      total: 0,
      page: 1,
      totalPages: 1,
    };
  }
}

/**
 * Funcion para obtener las ordenes del usuario
 */
export async function getUserOrdens(userId: string) {
  try {
    if (!userId) return [];

    const ordenes = await prisma.orden.findMany({
      where: { buyerId: userId },
      include: {
        product: true,
      },
    });

    if (!ordenes) return [];

    return ordenes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Funcion para obtener las ordenes del vendedor
 */
export async function getVendedorOrdens(userId: string) {
  try {
    if (!userId) return [];

    const ordenes = await prisma.orden.findMany({
      where: { vendorId: userId },
      include: {
        product: true,
      },
    });

    if (!ordenes) return [];

    return ordenes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Funcion para obtener la orden del vendedor por id
 */
export async function getOrdenByID(orderId: string) {
  try {
    if (!orderId) return null;

    const orden = await prisma.orden.findUnique({
      where: { id: orderId },
      include: {
        product: true,
      },
    });

    if (!orden) return null;

    return orden;
  } catch (error) {
    console.error(error);
    return null;
  }
}
