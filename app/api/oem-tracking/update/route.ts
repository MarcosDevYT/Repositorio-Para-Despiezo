import { NextResponse } from "next/server";
import { upsertOemTracking } from "@/actions/oem-tracking-actions";

// POST /api/oem-tracking/update - Actualizar tracking de un producto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, oem } = body;

    if (!productId || !oem) {
      return NextResponse.json(
        { success: false, error: "productId y oem son requeridos" },
        { status: 400 }
      );
    }

    const result = await upsertOemTracking(productId, oem);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      tracker: result.tracker,
    });
  } catch (error) {
    console.error("Error al actualizar tracking:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el tracking" },
      { status: 500 }
    );
  }
}
