import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const userId = searchParams.get("userId"); // 👈 opcional

  let historial: any[] = [];
  let popular: any[] = [];
  let suggestions: any[] = [];

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
      const key = `${r.name?.toLowerCase() || ""}-${r.brand?.toLowerCase() || ""}-${r.model?.toLowerCase() || ""}-${r.year || ""}`;
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
    popular: popular.map((p) => ({
      type: "popular",
      query: p.query,
      clicks: p.clicks,
    })),
    history: historial, // 👈 historial del usuario
  });
}
