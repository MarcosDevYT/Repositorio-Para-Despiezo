import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true,
            businessName: true,
            averageRating: true,
            totalReviews: true,
            createdAt: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Get OEM compatibilities
    let oemCompatibilidades: any[] = [];
    if (product.oemNumber) {
      const oemPieza = await prisma.oemPieza.findUnique({
        where: { oem: product.oemNumber.trim().toUpperCase() },
        include: { compatibilidades: { orderBy: { createdAt: "desc" } } },
      });
      oemCompatibilidades = oemPieza?.compatibilidades || [];
    }

    // Get user compatibilities
    const compatibilidades = await prisma.compatibilidad.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
    });

    // Get related products from same vendor
    const relatedProducts = await prisma.product.findMany({
      where: { vendorId: product.vendorId, id: { not: id }, status: "publicado" },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    // Increment clicks
    await prisma.product.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      product: JSON.parse(JSON.stringify(product)),
      oemCompatibilidades: JSON.parse(JSON.stringify(oemCompatibilidades)),
      compatibilidades: JSON.parse(JSON.stringify(compatibilidades)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    });
  } catch (error) {
    console.error("Mobile product detail error:", error);
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
  }
}
