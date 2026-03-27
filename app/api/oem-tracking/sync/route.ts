import { NextResponse } from "next/server";
import { syncAllProductsTracking } from "@/actions/oem-tracking-actions";

// POST /api/oem-tracking/sync - Sincronizar todos los productos con OEM
export async function POST(req: Request) {
  try {
    const result = await syncAllProductsTracking();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      created: result.created,
      updated: result.updated,
      total: result.total,
    });
  } catch (error) {
    console.error("Error al sincronizar tracking:", error);
    return NextResponse.json(
      { success: false, error: "Error al sincronizar el tracking" },
      { status: 500 }
    );
  }
}
