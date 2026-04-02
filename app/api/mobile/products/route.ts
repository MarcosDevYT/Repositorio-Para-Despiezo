import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getYearsFromRange } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || "";
    const categoria = searchParams.get("categoria") || "";
    const subcategoria = searchParams.get("subcategoria") || "";
    const oem = searchParams.get("oem") || "";
    const marca = searchParams.get("marca") || "";
    const modelo = searchParams.get("modelo") || "";
    const estado = searchParams.get("estado") || "";
    const año = searchParams.get("año") || searchParams.get("anio") || "";
    const tipoDeVehiculo = searchParams.get("tipoDeVehiculo") || "";
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const orderBy = (searchParams.get("orderBy") || "createdAt") as "price" | "name" | "createdAt";
    const orderDirection = (searchParams.get("orderDirection") || "desc") as "asc" | "desc";

    const andConditions: any[] = [{ status: "publicado" }];

    if (query.trim()) {
      andConditions.push({
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { model: { contains: query, mode: "insensitive" } },
          { oemNumber: { contains: query, mode: "insensitive" } },
        ],
      });
    }

    if (categoria.trim()) andConditions.push({ category: categoria });
    if (subcategoria.trim()) andConditions.push({ subcategory: subcategoria });
    if (oem.trim()) andConditions.push({ oemNumber: oem });
    if (marca.trim()) andConditions.push({ brand: { contains: marca, mode: "insensitive" } });
    if (modelo.trim()) andConditions.push({ model: { contains: modelo, mode: "insensitive" } });

    if (estado.trim()) {
      const estados = estado.split(",");
      if (estados.length > 1) {
        andConditions.push({ condition: { in: estados } });
      } else {
        andConditions.push({ condition: estado });
      }
    }

    if (año.trim()) {
      const yearValues = año.split(",").flatMap((y: string) => getYearsFromRange(y));
      if (yearValues.length > 0) {
        andConditions.push({ year: { in: yearValues } });
      }
    }

    if (tipoDeVehiculo.trim()) andConditions.push({ tipoDeVehiculo });

    if (priceMin || priceMax) {
      andConditions.push({
        OR: [
          {
            offer: true,
            offerPrice: {
              ...(priceMin && { gte: priceMin }),
              ...(priceMax && { lte: priceMax }),
            },
          },
          {
            offer: false,
            price: {
              ...(priceMin && { gte: priceMin }),
              ...(priceMax && { lte: priceMax }),
            },
          },
        ],
      });
    }

    const where = { AND: andConditions };
    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { featuredUntil: { sort: "desc", nulls: "last" } },
        { [orderBy]: orderDirection },
      ],
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      products: JSON.parse(JSON.stringify(products)),
    });
  } catch (error) {
    console.error("Mobile products error:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
