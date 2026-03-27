import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/oem-tracking/pending - Obtener solo productos SIN compatibilidades
export async function GET(req: Request) {
  try {
    // Obtener solo productos con status: false (sin compatibilidades)
    const trackers = await prisma.oemCompatibilityTracker.findMany({
      where: {
        OR: [
          { status: false },
          { compatibilityCount: 0 },
        ],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            oemNumber: true,
            status: true,
          },
        },
      },
      orderBy: [
        {
          lastCheckedAt: "asc", // más antiguos primero (necesitan actualización)
        },
      ],
    });

    // Formatear respuesta para exportar a otro proyecto
    const pendingOems = trackers.map((tracker) => ({
      productId: tracker.productId,
      oem: tracker.oem,
      productName: tracker.product?.name || "Sin nombre",
      lastCheckedAt: tracker.lastCheckedAt,
    }));

    return NextResponse.json({
      success: true,
      data: pendingOems,
      total: pendingOems.length,
      message: `${pendingOems.length} productos sin compatibilidades`,
    });
  } catch (error) {
    console.error("Error al obtener productos pendientes:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos pendientes" },
      { status: 500 }
    );
  }
}
