import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/compatibilidades-oem - Obtener listado plano de compatibilidades con datos del OEM
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";
    const marca = searchParams.get("marca") || "";
    const modelo = searchParams.get("modelo") || "";
    const anio = searchParams.get("anio") || "";

    // Construir filtros para compatibilidades
    const whereClause: any = {};
    
    if (marca && marca !== "all") {
      whereClause.marca = { equals: marca, mode: "insensitive" };
    }
    if (modelo && modelo !== "all") {
      whereClause.modelo = { contains: modelo, mode: "insensitive" };
    }
    if (anio && anio !== "all") {
      whereClause.anio = { contains: anio, mode: "insensitive" };
    }
    
    // Búsqueda por OEM o nombre de pieza
    if (search) {
      whereClause.oemPieza = {
        OR: [
          { oem: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [compatibilidades, total] = await Promise.all([
      prisma.oemCompatibilidad.findMany({
        where: whereClause,
        include: {
          oemPieza: {
            select: {
              oem: true,
              name: true,
              site: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.oemCompatibilidad.count({ where: whereClause }),
    ]);

    // Obtener valores únicos para filtros de modelo y año
    const [modelos, anios] = await Promise.all([
      prisma.oemCompatibilidad.findMany({
        select: { modelo: true },
        distinct: ["modelo"],
        where: { modelo: { not: null } },
        orderBy: { modelo: "asc" },
      }),
      prisma.oemCompatibilidad.findMany({
        select: { anio: true },
        distinct: ["anio"],
        where: { anio: { not: null } },
        orderBy: { anio: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      count: compatibilidades.length,
      limit,
      offset,
      filters: {
        modelos: modelos.map((m) => m.modelo).filter(Boolean),
        anios: anios.map((a) => a.anio).filter(Boolean),
      },
      compatibilidades,
    });
  } catch (error) {
    console.error("Error al obtener compatibilidades OEM:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener compatibilidades OEM" },
      { status: 500 }
    );
  }
}

// POST /api/compatibilidades-oem - Crear o actualizar pieza OEM con compatibilidades
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validar estructura esperada del servicio externo
    if (!body.success || !body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { success: false, error: "Formato de datos inválido" },
        { status: 400 }
      );
    }

    const results = [];

    for (const item of body.data) {
      // Extraer OEM del item
      const oem =
        item.features?.nmerodepiezaoeoem ||
        item.features?.nmerodepiezadelfabricante ||
        body.message?.match(/pieza:\s*(\w+)/i)?.[1] ||
        null;

      if (!oem) {
        results.push({ error: "No se pudo extraer el OEM del item", item });
        continue;
      }

      // Upsert de la pieza OEM
      const pieza = await prisma.oemPieza.upsert({
        where: { oem: oem.toUpperCase() },
        update: {
          site: item.site || null,
          name: item.name || null,
          price: item.price || null,
          priceEUR: item.priceEUR || null,
          url: item.url || null,
          features: item.features || null,
          updatedAt: new Date(),
        },
        create: {
          oem: oem.toUpperCase(),
          site: item.site || null,
          name: item.name || null,
          price: item.price || null,
          priceEUR: item.priceEUR || null,
          url: item.url || null,
          features: item.features || null,
        },
      });

      // Eliminar compatibilidades anteriores y crear nuevas
      if (item.compatibilidad && Array.isArray(item.compatibilidad)) {
        await prisma.oemCompatibilidad.deleteMany({
          where: { oemPiezaId: pieza.id },
        });

        const compatibilidades = item.compatibilidad.map((comp: any) => {
          // Extraer campos conocidos
          const { marca, modelo, año, anio, variante, tipo, chasis, motor, ...extra } = comp;

          return {
            oemPiezaId: pieza.id,
            marca: marca || null,
            modelo: modelo || null,
            anio: año || anio || null,
            variante: variante || null,
            tipo: tipo || null,
            chasis: chasis || null,
            motor: motor || null,
            atributosExtra: Object.keys(extra).length > 0 ? extra : null,
          };
        });

        await prisma.oemCompatibilidad.createMany({
          data: compatibilidades,
        });
      }

      results.push({
        success: true,
        oem: pieza.oem,
        id: pieza.id,
        compatibilidadesCount: item.compatibilidad?.length || 0,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Datos procesados correctamente",
      results,
    });
  } catch (error) {
    console.error("Error al guardar compatibilidades OEM:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar compatibilidades OEM" },
      { status: 500 }
    );
  }
}
