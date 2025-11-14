"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  compatibilidadSchema,
  reviewSchema,
} from "@/lib/zodSchemas/ReviewSchemas";
import { OrdenFull } from "@/types/ProductTypes";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Action para crear reviews de una orden
 */
export async function createReviewAction(
  orden: OrdenFull,
  data: z.infer<typeof reviewSchema>
) {
  try {
    // 1. Validar datos del formulario
    const validatedData = reviewSchema.parse(data);

    // 2. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Debes iniciar sesión para dejar una reseña");
    }

    const userId = session.user.id;
    const buyerId = orden.buyerId;
    const ordenId = orden.id;

    // 3. Verificar que el usuario es el comprador
    if (buyerId !== userId) {
      throw new Error("No tienes permiso para reseñar esta orden");
    }

    // 4. Verificar si ya existe una reseña para esta orden
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_ordenId: {
          userId,
          ordenId,
        },
      },
    });

    if (existingReview) {
      throw new Error("Ya has reseñado esta orden");
    }

    // 5. Crear reseña
    await prisma.review.create({
      data: {
        userId,
        ordenId,
        vendorId: orden.vendorId,
        rating: validatedData.rating,
        comentario: validatedData.comentario || null,
      },
    });

    // 6. Recalcular promedio de calificaciones del vendedor
    const reviews = await prisma.review.findMany({
      where: { vendorId: orden.vendorId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // 7. Actualizar el vendedor
    await prisma.user.update({
      where: { id: orden.vendorId },
      data: { averageRating, totalReviews },
    });

    // 8. Revalidar rutas relevantes
    revalidatePath(`/perfil/compras/${ordenId}`);
    revalidatePath("/perfil/compras");

    return {
      success: true,
      message: "Reseña enviada exitosamente",
    };
  } catch (error) {
    console.error("Error al crear reseña:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos de reseña inválidos");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al procesar la reseña");
  }
}

// Action para verificar si el usuario ya dejó una reseña para esta orden (por algún producto)
export async function checkReviewExists(ordenId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }

    const review = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        ordenId,
      },
    });

    return !!review;
  } catch (error) {
    console.error("Error al verificar reseña:", error);
    return false;
  }
}

export type VendedorReview = Awaited<
  ReturnType<typeof getVendedorReviews>
>[number];

// Acción para obtener las reviews del vendedor
export async function getVendedorReviews(vendedorId: string) {
  const reviews = await prisma.review.findMany({
    where: { vendorId: vendedorId },
    select: {
      comentario: true,
      createdAt: true,
      id: true,
      rating: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      orden: {
        select: {
          items: {
            select: {
              product: {
                select: {
                  name: true,
                  images: true,
                },
              },
              kit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
}

// Action paraa guardar las compatibilidades en la base de datos
export async function saveCompatibilidadAction(
  orden: OrdenFull,
  productIds: string[],
  data: z.infer<typeof compatibilidadSchema>
) {
  try {
    // 1. Validar datos del formulario
    const validatedData = compatibilidadSchema.parse(data);

    // 2. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Debes iniciar sesión para registrar compatibilidad");
    }

    // 3. Obtener la orden
    const userId = session.user.id;
    const ordenId = orden.id;

    if (!orden) {
      throw new Error("Orden no encontrada");
    }

    if (orden.buyerId !== userId) {
      throw new Error(
        "No tienes permiso para registrar compatibilidad en esta orden"
      );
    }

    // Permitir solo si el status es 'completed' o 'delivered'
    if (orden.status !== "completed" && orden.status !== "delivered") {
      throw new Error(
        `Solo puedes registrar compatibilidad en órdenes completadas o entregadas (Estado actual: ${orden.status})`
      );
    }

    // 5. Crear registros de compatibilidad para cada producto
    const compatibilidades = productIds.map((productId) => ({
      userId,
      ordenId,
      productId,
      encajo: validatedData.encajo,
      marca: validatedData.marca,
      modelo: validatedData.modelo,
      anio: validatedData.anio,
      version: validatedData.version || null,
      motorizacion: validatedData.motorizacion || null,
      combustible: validatedData.combustible,
      transmision: validatedData.transmision,
    }));

    // 6. Guardar en la base de datos
    await prisma.compatibilidad.createMany({
      data: compatibilidades,
    });

    // 7. Revalidar rutas
    revalidatePath(`/perfil/compras/${ordenId}`);
    revalidatePath("/perfil/compras");

    return {
      success: true,
      message:
        productIds.length > 1
          ? `Compatibilidad registrada para ${productIds.length} productos`
          : "Compatibilidad registrada correctamente",
    };
  } catch (error) {
    console.error("Error al guardar compatibilidad:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos de compatibilidad inválidos");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al procesar la compatibilidad");
  }
}

// Acción para verificar si ya se registró compatibilidad
export async function checkCompatibilidadExists(
  ordenId: string,
  productId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }

    const compatibilidad = await prisma.compatibilidad.findFirst({
      where: {
        userId: session.user.id,
        ordenId,
        productId,
      },
    });

    return !!compatibilidad;
  } catch (error) {
    console.error("Error al verificar compatibilidad:", error);
    return false;
  }
}
