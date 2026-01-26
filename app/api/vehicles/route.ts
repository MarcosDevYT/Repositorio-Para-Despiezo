import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/vehicles - Obtener listado de vehículos cacheados
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const minParams = searchParams.get("minParams");
    const maxParams = searchParams.get("maxParams");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Construir condiciones de filtro
    let whereConditions: any = {};

    // Filtrar por cantidad de parámetros no nulos
    if (minParams || maxParams) {
      const min = minParams ? parseInt(minParams) : undefined;
      const max = maxParams ? parseInt(maxParams) : undefined;

      // Obtener todos los vehículos y filtrar en memoria
      const allVehicles = await prisma.vehicle.findMany({
        orderBy: { updatedAt: "desc" },
      });

      const filteredVehicles = allVehicles.filter((vehicle) => {
        // Contar parámetros no nulos (excluyendo id, plate, source, title, fullName, createdAt, updatedAt)
        const paramCount = [
          vehicle.tipo,
          vehicle.yearRange,
          vehicle.bodyType,
          vehicle.driveType,
          vehicle.powerKw,
          vehicle.powerHp,
          vehicle.displacement,
          vehicle.cylinders,
          vehicle.valves,
          vehicle.engineType,
          vehicle.engineCode,
          vehicle.transmission,
          vehicle.fuelType,
          vehicle.fuelPreparation,
          vehicle.brakeSystem,
        ].filter((param) => param !== null && param !== "").length;

        if (min !== undefined && max !== undefined) {
          return paramCount >= min && paramCount <= max;
        } else if (min !== undefined) {
          return paramCount >= min;
        } else if (max !== undefined) {
          return paramCount <= max;
        }
        return true;
      });

      const paginatedVehicles = filteredVehicles.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        total: filteredVehicles.length,
        count: paginatedVehicles.length,
        limit,
        offset,
        vehicles: paginatedVehicles.map((v) => ({
          plate: v.plate,
          source: v.source,
          title: v.title,
          fullName: v.fullName,
          tipo: v.tipo,
          yearRange: v.yearRange,
          bodyType: v.bodyType,
          driveType: v.driveType,
          powerKw: v.powerKw,
          powerHp: v.powerHp,
          displacement: v.displacement,
          cylinders: v.cylinders,
          valves: v.valves,
          engineType: v.engineType,
          engineCode: v.engineCode,
          transmission: v.transmission,
          fuelType: v.fuelType,
          fuelPreparation: v.fuelPreparation,
          brakeSystem: v.brakeSystem,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        })),
      });
    }

    // Sin filtros, consulta directa con paginación
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where: whereConditions,
        orderBy: { updatedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.vehicle.count({ where: whereConditions }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      count: vehicles.length,
      limit,
      offset,
      vehicles: vehicles.map((v) => ({
        plate: v.plate,
        source: v.source,
        title: v.title,
        fullName: v.fullName,
        tipo: v.tipo,
        yearRange: v.yearRange,
        bodyType: v.bodyType,
        driveType: v.driveType,
        powerKw: v.powerKw,
        powerHp: v.powerHp,
        displacement: v.displacement,
        cylinders: v.cylinders,
        valves: v.valves,
        engineType: v.engineType,
        engineCode: v.engineCode,
        transmission: v.transmission,
        fuelType: v.fuelType,
        fuelPreparation: v.fuelPreparation,
        brakeSystem: v.brakeSystem,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener vehículos",
      },
      { status: 500 }
    );
  }
}
