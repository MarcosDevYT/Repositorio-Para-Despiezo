import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/compatibilidades-oem/[oem] - Obtener pieza OEM específica
export async function GET(
  req: Request,
  { params }: { params: { oem: string } }
) {
  try {
    const oem = params.oem.toUpperCase().trim();

    if (!oem) {
      return NextResponse.json(
        { success: false, error: "El OEM es requerido" },
        { status: 400 }
      );
    }

    const pieza = await prisma.oemPieza.findUnique({
      where: { oem },
      include: {
        compatibilidades: true,
      },
    });

    if (!pieza) {
      return NextResponse.json(
        { success: false, error: "Pieza OEM no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pieza,
    });
  } catch (error) {
    console.error("Error al obtener pieza OEM:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener pieza OEM" },
      { status: 500 }
    );
  }
}

// DELETE /api/compatibilidades-oem/[oem] - Eliminar pieza OEM
export async function DELETE(
  req: Request,
  { params }: { params: { oem: string } }
) {
  try {
    const oem = params.oem.toUpperCase().trim();

    if (!oem) {
      return NextResponse.json(
        { success: false, error: "El OEM es requerido" },
        { status: 400 }
      );
    }

    const pieza = await prisma.oemPieza.findUnique({
      where: { oem },
    });

    if (!pieza) {
      return NextResponse.json(
        { success: false, error: "Pieza OEM no encontrada" },
        { status: 404 }
      );
    }

    await prisma.oemPieza.delete({
      where: { oem },
    });

    return NextResponse.json({
      success: true,
      message: "Pieza OEM eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar pieza OEM:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar pieza OEM" },
      { status: 500 }
    );
  }
}
