"use server";

import { prisma } from "@/lib/prisma";

/**
 * Registra o actualiza el tracking de compatibilidades OEM para un producto
 */
export async function upsertOemTracking(productId: string, oem: string) {
  try {
    if (!oem || oem.trim() === "") {
      return { success: false, error: "OEM es requerido" };
    }

    const oemNormalized = oem.trim().toUpperCase();

    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, oemNumber: true },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    // Verificar si ya existe compatibilidades para este OEM
    const oemPieza = await prisma.oemPieza.findUnique({
      where: { oem: oemNormalized },
      include: {
        compatibilidades: true,
      },
    });

    const hasCompatibilities = oemPieza && oemPieza.compatibilidades.length > 0;
    const compatibilityCount = oemPieza?.compatibilidades.length || 0;

    // Crear o actualizar el tracker
    const tracker = await prisma.oemCompatibilityTracker.upsert({
      where: { productId },
      update: {
        oem: oemNormalized,
        status: hasCompatibilities,
        compatibilityCount,
        lastCheckedAt: new Date(),
      },
      create: {
        productId,
        oem: oemNormalized,
        status: hasCompatibilities,
        compatibilityCount,
      },
    });

    return { success: true, tracker };
  } catch (error) {
    console.error("Error al registrar tracking OEM:", error);
    return { success: false, error: "Error al registrar el tracking" };
  }
}

/**
 * Actualiza el estado de compatibilidades para un producto específico
 */
export async function updateOemTrackingStatus(productId: string) {
  try {
    const tracker = await prisma.oemCompatibilityTracker.findUnique({
      where: { productId },
    });

    if (!tracker) {
      return { success: false, error: "Tracker no encontrado" };
    }

    // Verificar compatibilidades actuales
    const oemPieza = await prisma.oemPieza.findUnique({
      where: { oem: tracker.oem },
      include: {
        compatibilidades: true,
      },
    });

    const hasCompatibilities = oemPieza && oemPieza.compatibilidades.length > 0;
    const compatibilityCount = oemPieza?.compatibilidades.length || 0;

    // Actualizar solo si el estado cambió
    if (tracker.status !== hasCompatibilities || tracker.compatibilityCount !== compatibilityCount) {
      await prisma.oemCompatibilityTracker.update({
        where: { productId },
        data: {
          status: hasCompatibilities,
          compatibilityCount,
          lastCheckedAt: new Date(),
        },
      });
    }

    return { success: true, status: hasCompatibilities, compatibilityCount };
  } catch (error) {
    console.error("Error al actualizar tracking OEM:", error);
    return { success: false, error: "Error al actualizar el tracking" };
  }
}

/**
 * Sincroniza todos los productos que tienen OEM
 */
export async function syncAllProductsTracking() {
  try {
    // Obtener TODOS los productos que tienen OEM (no vacío y no null)
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            oemNumber: {
              not: null,
            },
          },
          {
            oemNumber: {
              not: "",
            },
          },
        ],
      },
      select: {
        id: true,
        oemNumber: true,
      },
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Verificar que el OEM sea válido
      if (!product.oemNumber || product.oemNumber.trim() === "") {
        skipped++;
        continue;
      }

      const result = await upsertOemTracking(product.id, product.oemNumber);
      if (result.success) {
        // Verificar si fue creado o actualizado comparando timestamps
        const existing = await prisma.oemCompatibilityTracker.findUnique({
          where: { productId: product.id },
        });
        
        if (existing) {
          const timeDiff = Math.abs(existing.createdAt.getTime() - existing.updatedAt.getTime());
          if (timeDiff < 1000) {
            created++;
          } else {
            updated++;
          }
        }
      } else {
        skipped++;
      }
    }

    return { success: true, created, updated, total: products.length, skipped };
  } catch (error) {
    console.error("Error al sincronizar tracking:", error);
    return { success: false, error: "Error al sincronizar el tracking" };
  }
}
