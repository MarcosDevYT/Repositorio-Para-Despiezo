import { NextResponse } from "next/server";

// GET /api/fastebay?oem=XXXXX - Proxy para obtener compatibilidades desde la API externa
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const oem = searchParams.get("oem");

    if (!oem || oem.trim() === "") {
      return NextResponse.json(
        { success: false, error: "El número OEM es requerido" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://despiezo.solvedia.app/fastebay/${encodeURIComponent(oem.trim())}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "No se encontraron datos para este OEM" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error en fastebay proxy:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar compatibilidades" },
      { status: 500 }
    );
  }
}
