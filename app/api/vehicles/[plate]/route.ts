import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/vehicles/[plate] - Obtener datos de un vehículo específico
export async function GET(
  req: Request,
  { params }: { params: { plate: string } },
) {
  try {
    const plate = params.plate.toLowerCase().trim();

    if (!plate) {
      return NextResponse.json(
        {
          success: false,
          error: "La matrícula es requerida",
        },
        { status: 400 },
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { plate },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehículo no encontrado",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      vehicle: {
        plate: vehicle.plate,
        source: vehicle.source,
        title: vehicle.title,
        fullName: vehicle.fullName,
        tipo: vehicle.tipo,
        yearRange: vehicle.yearRange,
        bodyType: vehicle.bodyType,
        driveType: vehicle.driveType,
        powerKw: vehicle.powerKw,
        powerHp: vehicle.powerHp,
        displacement: vehicle.displacement,
        cylinders: vehicle.cylinders,
        valves: vehicle.valves,
        engineType: vehicle.engineType,
        engineCode: vehicle.engineCode,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        fuelPreparation: vehicle.fuelPreparation,
        brakeSystem: vehicle.brakeSystem,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error al obtener vehículo:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener vehículo",
      },
      { status: 500 },
    );
  }
}

// POST /api/vehicles/[plate] - Crear o actualizar datos de un vehículo
export async function POST(
  req: Request,
  { params }: { params: { plate: string } },
) {
  try {
    const plate = params.plate.toLowerCase().trim();

    if (!plate) {
      return NextResponse.json(
        {
          success: false,
          error: "La matrícula es requerida",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Validar campos requeridos
    if (!body.source || !body.title || !body.fullName) {
      return NextResponse.json(
        {
          success: false,
          error: "Los campos source, title y fullName son requeridos",
        },
        { status: 400 },
      );
    }

    // Preparar datos para crear/actualizar
    const vehicleData = {
      plate,
      source: body.source,
      title: body.title,
      fullName: body.fullName,
      tipo: body.tipo || null,
      yearRange: body.yearRange || null,
      bodyType: body.bodyType || null,
      driveType: body.driveType || null,
      powerKw: body.powerKw || null,
      powerHp: body.powerHp || null,
      displacement: body.displacement || null,
      cylinders: body.cylinders || null,
      valves: body.valves || null,
      engineType: body.engineType || null,
      engineCode: body.engineCode || null,
      transmission: body.transmission || null,
      fuelType: body.fuelType || null,
      fuelPreparation: body.fuelPreparation || null,
      brakeSystem: body.brakeSystem || null,
    };

    // Upsert: crear si no existe, actualizar si existe
    const vehicle = await prisma.vehicle.upsert({
      where: { plate },
      update: vehicleData,
      create: vehicleData,
    });

    return NextResponse.json({
      success: true,
      message: "Vehículo guardado correctamente",
      vehicle: {
        plate: vehicle.plate,
        source: vehicle.source,
        title: vehicle.title,
        fullName: vehicle.fullName,
        tipo: vehicle.tipo,
        yearRange: vehicle.yearRange,
        bodyType: vehicle.bodyType,
        driveType: vehicle.driveType,
        powerKw: vehicle.powerKw,
        powerHp: vehicle.powerHp,
        displacement: vehicle.displacement,
        cylinders: vehicle.cylinders,
        valves: vehicle.valves,
        engineType: vehicle.engineType,
        engineCode: vehicle.engineCode,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        fuelPreparation: vehicle.fuelPreparation,
        brakeSystem: vehicle.brakeSystem,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error al guardar vehículo:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al guardar vehículo",
      },
      { status: 500 },
    );
  }
}
