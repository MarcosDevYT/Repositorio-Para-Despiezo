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
      const min = minParams ? parseInt(minParams) : 0;
      const max = maxParams ? parseInt(maxParams) : 999;

      // Usar queryRaw para filtrar por conteo de campos no nulos directamente en la DB
      const vehiclesResult = await prisma.$queryRawUnsafe<any[]>(`
        SELECT *, (
          (CASE WHEN tipo IS NOT NULL AND tipo != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "yearRange" IS NOT NULL AND "yearRange" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "bodyType" IS NOT NULL AND "bodyType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "driveType" IS NOT NULL AND "driveType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "powerKw" IS NOT NULL AND "powerKw" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "powerHp" IS NOT NULL AND "powerHp" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "displacement" IS NOT NULL AND "displacement" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN cylinders IS NOT NULL AND cylinders != '' THEN 1 ELSE 0 END) +
          (CASE WHEN valves IS NOT NULL AND valves != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "engineType" IS NOT NULL AND "engineType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "engineCode" IS NOT NULL AND "engineCode" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN transmission IS NOT NULL AND transmission != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "fuelType" IS NOT NULL AND "fuelType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "fuelPreparation" IS NOT NULL AND "fuelPreparation" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "brakeSystem" IS NOT NULL AND "brakeSystem" != '' THEN 1 ELSE 0 END)
        ) as param_count
        FROM "Vehicle"
        WHERE 1=1
        HAVING (
          (CASE WHEN tipo IS NOT NULL AND tipo != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "yearRange" IS NOT NULL AND "yearRange" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "bodyType" IS NOT NULL AND "bodyType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "driveType" IS NOT NULL AND "driveType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "powerKw" IS NOT NULL AND "powerKw" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "powerHp" IS NOT NULL AND "powerHp" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "displacement" IS NOT NULL AND "displacement" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN cylinders IS NOT NULL AND cylinders != '' THEN 1 ELSE 0 END) +
          (CASE WHEN valves IS NOT NULL AND valves != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "engineType" IS NOT NULL AND "engineType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "engineCode" IS NOT NULL AND "engineCode" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN transmission IS NOT NULL AND transmission != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "fuelType" IS NOT NULL AND "fuelType" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "fuelPreparation" IS NOT NULL AND "fuelPreparation" != '' THEN 1 ELSE 0 END) +
          (CASE WHEN "brakeSystem" IS NOT NULL AND "brakeSystem" != '' THEN 1 ELSE 0 END)
        ) BETWEEN $1 AND $2
        ORDER BY "updatedAt" DESC
        LIMIT $3 OFFSET $4
      `, min, max, limit, offset);

      const totalResult = await prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*) as count FROM (
          SELECT id
          FROM "Vehicle"
          WHERE 1=1
          HAVING (
            (CASE WHEN tipo IS NOT NULL AND tipo != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "yearRange" IS NOT NULL AND "yearRange" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "bodyType" IS NOT NULL AND "bodyType" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "driveType" IS NOT NULL AND "driveType" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "powerKw" IS NOT NULL AND "powerKw" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "powerHp" IS NOT NULL AND "powerHp" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "displacement" IS NOT NULL AND "displacement" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN cylinders IS NOT NULL AND cylinders != '' THEN 1 ELSE 0 END) +
            (CASE WHEN valves IS NOT NULL AND valves != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "engineType" IS NOT NULL AND "engineType" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "engineCode" IS NOT NULL AND "engineCode" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN transmission IS NOT NULL AND transmission != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "fuelType" IS NOT NULL AND "fuelType" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "fuelPreparation" IS NOT NULL AND "fuelPreparation" != '' THEN 1 ELSE 0 END) +
            (CASE WHEN "brakeSystem" IS NOT NULL AND "brakeSystem" != '' THEN 1 ELSE 0 END)
          ) BETWEEN $1 AND $2
        ) as count_table
      `, min, max);

      const total = Number(totalResult[0]?.count || 0);

      return NextResponse.json({
        success: true,
        total,
        count: vehiclesResult.length,
        limit,
        offset,
        vehicles: vehiclesResult.map((v) => ({
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
