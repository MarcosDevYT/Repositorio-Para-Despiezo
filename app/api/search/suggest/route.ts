import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const userId = searchParams.get("userId");

  let historial: any[] = [];
  let popular: any[] = [];
  let suggestions: any[] = [];
  let oemSuggestions: any[] = [];
  let productsByOem: any[] = [];

  // 🔹 Historial de búsqueda del usuario (si hay userId)
  if (userId) {
    historial = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  }

  // 🔹 Populares (siempre)
  popular = await prisma.searchLog.findMany({
    orderBy: { clicks: "desc" },
    take: 5,
  });

  // 🔹 Sugerencias si hay query
  if (q) {
    // 🔹 Buscar en OemPieza por código OEM o nombre
    const oemPiezas = await prisma.oemPieza.findMany({
      where: {
        OR: [
          { oem: { contains: q.toUpperCase() } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        oem: true,
        name: true,
        site: true,
        _count: {
          select: { compatibilidades: true },
        },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    oemSuggestions = oemPiezas.map((p) => ({
      type: "oem",
      id: p.id,
      oem: p.oem,
      name: p.name,
      site: p.site,
      compatCount: p._count.compatibilidades,
    }));

    // 🔹 Buscar productos por oemNumber (exacto o parcial)
    const productsWithOem = await prisma.product.findMany({
      where: {
        oemNumber: {
          contains: q,
          mode: "insensitive",
        },
        status: "activo",
      },
      select: {
        id: true,
        name: true,
        oemNumber: true,
        brand: true,
        model: true,
        year: true,
        price: true,
        images: true,
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    productsByOem = productsWithOem.map((p) => ({
      type: "product-oem",
      id: p.id,
      name: p.name,
      oemNumber: p.oemNumber,
      brand: p.brand,
      model: p.model,
      year: p.year,
      price: p.price,
      image: p.images?.[0] || null,
    }));

    const tsQuery = q
      .split(/\s+/)
      .map((w) => `${w}:*`)
      .join(" & ");

    const results = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT id, "name", "brand", "model", "year", "oemNumber",
             ts_rank_cd(search_vector, to_tsquery('spanish', $1)) AS rank,
             GREATEST(
               similarity(LOWER("name"), LOWER($2)),
               similarity(LOWER("brand"), LOWER($2)),
               similarity(LOWER("model"), LOWER($2)),
               similarity(LOWER("oemNumber"), LOWER($2))
             ) AS sim
      FROM "Product"
      WHERE search_vector @@ to_tsquery('spanish', $1)
         OR similarity(LOWER("name"), LOWER($2)) > 0.2
         OR similarity(LOWER("brand"), LOWER($2)) > 0.2
         OR similarity(LOWER("model"), LOWER($2)) > 0.2
         OR similarity(LOWER("oemNumber"), LOWER($2)) > 0.2
      ORDER BY sim DESC, rank DESC
      LIMIT 50;
      `,
      tsQuery,
      q
    );

    // 🔹 Deduplicar resultados
    const unique = new Map<string, any>();
    for (const r of results) {
      const key = `${r.name?.toLowerCase() || ""}-${
        r.brand?.toLowerCase() || ""
      }-${r.model?.toLowerCase() || ""}-${r.year || ""}`;
      if (!unique.has(key)) {
        if (
          r.oemNumber &&
          r.oemNumber.toLowerCase().includes(q.toLowerCase())
        ) {
          unique.set(key, {
            type: "reference",
            oemNumber: r.oemNumber,
            id: r.id,
          });
        } else if (r.name) {
          unique.set(key, {
            type: "product",
            id: r.id,
            name: r.name,
            brand: r.brand,
            model: r.model,
            year: r.year,
            oemNumber: r.oemNumber,
          });
        } else {
          unique.set(key, {
            type: "model",
            brand: r.brand,
            model: r.model,
            year: r.year,
          });
        }
      }
    }

    suggestions = Array.from(unique.values()).slice(0, 10);
  }

  return NextResponse.json({
    suggestions,
    oemSuggestions,
    productsByOem,
    popular: popular.map((p) => ({
      type: "popular",
      query: p.query,
      clicks: p.clicks,
    })),
    history: historial,
  });
}
