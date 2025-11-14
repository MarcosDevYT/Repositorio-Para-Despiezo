import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Leer el parámetro OEM desde la query
    const { searchParams } = new URL(req.url);
    const oem = searchParams.get("oem");

    if (!oem) {
      return NextResponse.json(
        { error: "Falta el parámetro oem" },
        { status: 400 }
      );
    }

    // Controlador de timeout (máximo 4 minutos)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000 * 240);

    const response = await fetch(`https://despiezo.solvedia.app/easy/${oem}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error en el scrapper: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "La solicitud tardó demasiado (timeout)" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
