import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/oem-tracking - Listar productos y su estado de compatibilidades OEM
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    // Construir filtro
    const whereClause: any = {};
    if (statusFilter === "true") {
      whereClause.status = true;
    } else if (statusFilter === "false") {
      whereClause.status = false;
    }

    // Obtener todos los trackers con información del producto
    // Ordenar primero los productos SIN compatibilidades (status: false)
    const trackers = await prisma.oemCompatibilityTracker.findMany({
      where: whereClause,
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
          status: "asc", // false primero (sin compatibilidades)
        },
        {
          compatibilityCount: "asc", // menor cantidad primero
        },
        {
          updatedAt: "desc", // más recientes primero
        },
      ],
    });

    // Formatear respuesta
    const formattedData = trackers.map((tracker) => ({
      id: tracker.product.id,
      oem: tracker.oem,
      status: tracker.status,
      compatibilityCount: tracker.compatibilityCount,
      productName: tracker.product.name,
      productStatus: tracker.product.status,
      lastCheckedAt: tracker.lastCheckedAt,
      createdAt: tracker.createdAt,
      updatedAt: tracker.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
    });
  } catch (error) {
    console.error("Error al obtener tracking de OEM:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener el tracking de compatibilidades" },
      { status: 500 }
    );
  }
}
