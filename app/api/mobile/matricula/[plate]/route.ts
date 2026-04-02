import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ plate: string }> }) {
  try {
    const { plate } = await params;
    if (!plate || plate.trim().length === 0) {
      return NextResponse.json({ error: "La matrícula es requerida" }, { status: 400 });
    }

    const cleanPlate = plate.trim().toLowerCase();
    const basePlate = cleanPlate.includes("-") ? cleanPlate.split("-")[0] : cleanPlate;

    // Try external API first
    try {
      const url = `https://despiezo.solvedia.app/matricula/cached/${basePlate}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return NextResponse.json({ success: true, data });
        }
      }
    } catch (apiError) {
      console.error("External API error, trying local cache:", apiError);
    }

    // Fallback to local cache
    const variations = await prisma.vehicle.findMany({
      where: { plate: { startsWith: basePlate } },
      orderBy: { plate: "asc" },
    });

    const exactVariations = variations.filter(
      (v: any) => v.plate === basePlate || v.plate.startsWith(`${basePlate}-`)
    );

    if (exactVariations.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          plate: basePlate,
          source: exactVariations[0].source,
          vehicles: exactVariations.map((v: any) => ({
            plate: v.plate,
            title: v.title,
            fullName: v.fullName,
            yearRange: v.yearRange,
            fuelType: v.fuelType,
            engineCode: v.engineCode,
            powerHp: v.powerHp,
            displacement: v.displacement,
            transmission: v.transmission,
            bodyType: v.bodyType,
          })),
        },
      });
    }

    return NextResponse.json({ success: false, error: "Vehículo no encontrado" }, { status: 404 });
  } catch (error) {
    console.error("Mobile matricula error:", error);
    return NextResponse.json({ error: "Error al buscar matrícula" }, { status: 500 });
  }
}
