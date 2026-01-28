import { NextResponse } from "next/server";

const MARCAS_ENDPOINT = "https://despiezo.solvedia.app/autodoc/marcas/leer";

export async function GET() {
  try {
    const res = await fetch(MARCAS_ENDPOINT, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Error al obtener marcas" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      // Ordenar alfabéticamente
      const sorted = data.data.sort((a: any, b: any) =>
        a.marca.localeCompare(b.marca)
      );

      return NextResponse.json({
        success: true,
        data: sorted,
      });
    }

    return NextResponse.json({
      success: false,
      error: "Formato de respuesta inválido",
    });
  } catch (error) {
    console.error("Error fetching marcas:", error);
    return NextResponse.json(
      { success: false, error: "Error de conexión" },
      { status: 500 }
    );
  }
}
