"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { prisma } from "@/lib/prisma";
import { Product, User } from "@prisma/client";
import { buildTsQueryFromQueries } from "@/lib/utils";

type VendedorResType = {
  user: User | null;
  products: Product[];
  total: number;
  page: number;
  limit: number;
};

type ProductFilter = {
  query?: string; // nombre o descripción
  categoria?: string; // slug categoría
  subcategoria?: string; // slug subcategoría
  oem?: string; // OEM number
  marca?: string; // brand
  modelo?: string; // modelo
  estado?: string; // condition
  año?: string; // año del vehículo
  tipoDeVehiculo?: string; // coche, moto, furgoneta
  priceMin?: number; // precio mínimo
  priceMax?: number; // precio máximo
  page?: number; // página de paginación
  limit?: number; // cantidad por página
  orderBy?: "price" | "name" | "createdAt"; // campo para ordenar
  orderDirection?: "asc" | "desc"; // dirección
};

// Crear un producto
export const createProductAction = async (data: z.infer<typeof sellSchema>) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    // Traer al usuario con sus productos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { products: true },
    });

    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    // Filtrar solo productos que NO estén vendidos
    const activeProducts = user.products.filter(
      (product) => product.status !== "vendido"
    );

    // Si no es pro y ya tiene 40 productos activos → error
    if (!user.pro && activeProducts.length >= 40) {
      return {
        error:
          "Has alcanzado el límite de 40 productos. Actualiza a Pro para publicar más.",
      };
    }

    // Validar datos
    const validatedData = sellSchema.parse(data);

    // Crear el producto
    await prisma.product.create({
      data: {
        ...validatedData,
        vendorId: session.user.id,
      },
    });

    return { success: "Producto creado correctamente" };
  } catch (error) {
    console.log(error);
    return { error: "Error al crear el producto" };
  }
};

// Editar un producto
export async function updateProductAction(
  id: string,
  data: z.infer<typeof sellSchema>
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { error: "El producto no existe" };
    }

    if (product.vendorId !== session.user.id) {
      return { error: "No tienes permisos para editar este producto" };
    }

    // Si el producto ya está vendido → no se puede editar
    if (product.status === "vendido") {
      return { error: "No puedes editar un producto vendido" };
    }

    const validatedData = sellSchema.parse(data);

    await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return { success: "Producto actualizado correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al actualizar",
    };
  }
}

// Eliminar un producto
export async function deleteProductAction(id: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { error: "El producto no existe" };
    }

    if (product.vendorId !== session.user.id) {
      return { error: "No tienes permisos para eliminar este producto" };
    }

    // Si el producto ya está vendido → no se puede eliminar
    if (product.status === "vendido") {
      return { error: "No puedes eliminar un producto vendido" };
    }

    await prisma.product.delete({
      where: { id },
    });

    return { success: "Producto eliminado correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al eliminar",
    };
  }
}

// Obtener los productos del usuario
export const getUserProductsAction = async () => {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Obtener los productos del usuario
    const products = await prisma.product.findMany({
      where: {
        vendorId: session.user.id,
      },
    });

    return products;
  } catch (error) {
    console.log(error);
    return {
      error: "Error al obtener los productos",
    };
  }
};

// Obtener los productos del usuario
export const getUserAvaibleProductsAction = async () => {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Obtener los productos del usuario
    const products = await prisma.product.findMany({
      where: {
        vendorId: session.user.id,
        status: "publicado",
      },
      orderBy: { createdAt: "desc" },
    });

    return products;
  } catch (error) {
    console.log(error);
    return {
      error: "Error al obtener los productos",
    };
  }
};

/**
 * ACTIONS PARA
 * MOSTRAR LOS PRODUCTOS EN EL HOME
 * ULTIMOS, DESTACADOS, RECOMENDADOS, HISTORIAL, MAS BUSCADOS
 */

// Obtener todos los productos publicados
export const getProductsAction = async (userId?: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "publicado",
      },
      take: 10,
      include: {
        favorites: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => ({
      ...p,
      isFavorite: userId ? p.favorites.length > 0 : false,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Obtener los últimos productos vistos
export async function getLastViewedProducts(userId?: string) {
  if (!userId) return [];

  const views = await prisma.userProductView.findMany({
    where: {
      userId,
      product: {
        status: "publicado",
      },
    },
    // lo más reciente primero
    orderBy: { viewedAt: "desc" },
    take: 10,
    include: {
      product: {
        include: {
          favorites: {
            where: { userId },
            select: { id: true },
          },
        },
      },
    },
  });

  if (views.length === 0) {
    return [];
  }

  // devolvemos los productos con su estado de favorito
  return views.map((view) => ({
    ...view.product,
    isFavorite: view.product.favorites.length > 0,
  }));
}

/**
 * Obtiene los productos destacados vigentes
 * @param limit Cantidad de productos a traer (default = 10)
 */
export async function getFeaturedProducts(userId?: string) {
  const featured = await prisma.product.findMany({
    where: {
      status: "publicado",
      featuredUntil: { gte: new Date() }, // solo los vigentes
    },
    orderBy: { featuredAt: "desc" }, // prioridad a los más nuevos
    take: 10,
    include: {
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (featured.length === 0) return [];

  return featured.map((p) => ({
    ...p,
    isFavorite: userId ? p.favorites.length > 0 : false,
  }));
}

/**
 * Obtiene hasta `limit` productos (objetos Product completos) en base a los search logs más populares.
 * Solo devuelve productos con status = "publicado" y añade `isFavorite`.
 */
export async function getPopularProductsFromSearchLogs(
  userId?: string,
  limit = 10
): Promise<(Product & { isFavorite: boolean })[]> {
  try {
    // 1️⃣ Obtener top 5 términos más buscados
    const logs = await prisma.searchLog.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
      select: { query: true },
    });

    // 2️⃣ Obtener top 5 productos más cliqueados
    const topClickedProducts = await prisma.product.findMany({
      where: { status: "publicado" },
      orderBy: { clicks: "desc" },
      take: 5,
      select: { id: true, name: true, brand: true, model: true },
    });

    // Si no hay nada popular aún
    if (logs.length === 0 && topClickedProducts.length === 0) return [];

    // 3️⃣ Combinar consultas del search log + nombres de productos más cliqueados
    const combinedQueries = [
      ...logs.map((l) => (l.query || "").trim()),
      ...topClickedProducts.map((p) =>
        [p.name, p.brand, p.model].filter(Boolean).join(" ")
      ),
    ].filter(Boolean);

    if (combinedQueries.length === 0) return [];

    const { tsQuery, plain } = buildTsQueryFromQueries(combinedQueries);

    // 4️⃣ Buscar productos populares por similitud o relevancia semántica
    const idsResult = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT id
      FROM "Product"
      WHERE status = 'publicado'
        AND (
          search_vector @@ to_tsquery('spanish', $1)
          OR similarity(LOWER("name"), LOWER($2)) > 0.2
          OR similarity(LOWER("brand"), LOWER($2)) > 0.2
          OR similarity(LOWER("model"), LOWER($2)) > 0.2
          OR similarity(LOWER("oemNumber"), LOWER($2)) > 0.2
        )
      ORDER BY
        -- mayor peso a los clics y rank de texto
        ("clicks" * 0.02) +
        GREATEST(
          similarity(LOWER("name"), LOWER($2)),
          similarity(LOWER("brand"), LOWER($2)),
          similarity(LOWER("model"), LOWER($2)),
          similarity(LOWER("oemNumber"), LOWER($2))
        ) * 0.8 +
        ts_rank_cd(search_vector, to_tsquery('spanish', $1)) * 2
        DESC
      LIMIT $3;
    `,
      tsQuery,
      plain,
      limit
    );

    const ids = idsResult.map((r) => r.id);
    if (ids.length === 0) return [];

    // 5️⃣ Traer productos completos + favoritos
    const fullProducts = await prisma.product.findMany({
      where: { id: { in: ids }, status: "publicado" },
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    // 6️⃣ Mantener orden de popularidad y añadir isFavorite
    const byId = new Map(fullProducts.map((p) => [p.id, p]));

    return ids
      .map((id) => {
        const p = byId.get(id);
        if (!p) return null;
        const isFavorite = userId
          ? !!(p.favorites && p.favorites.length > 0)
          : false;
        return { ...p, isFavorite };
      })
      .filter(Boolean) as (Product & { isFavorite: boolean })[];
  } catch (error) {
    console.error("❌ getPopularProductsFromSearchLogs error:", error);
    return [];
  }
}

/**
 * Obtiene hasta 10 productos recomendados para un usuario específico.
 * Solo devuelve productos con status = "publicado" y añade `isFavorite`.
 */
export async function getRecommendedProductsForUser(
  userId?: string,
  limit = 10
): Promise<(Product & { isFavorite: boolean })[]> {
  try {
    if (!userId) return [];

    // 1) Traer search history y vistas en paralelo
    const [searchLogs, viewedProducts] = await Promise.all([
      prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { query: true },
      }),
      prisma.userProductView.findMany({
        where: { userId },
        orderBy: { viewedAt: "desc" },
        take: 5,
        select: { productId: true },
      }),
    ]);

    const queries = searchLogs
      .map((s) => (s.query || "").trim())
      .filter(Boolean);
    const viewedIds = viewedProducts.map((v) => v.productId);

    if (queries.length === 0 && viewedIds.length === 0) return [];

    const { tsQuery, plain } = buildTsQueryFromQueries(queries);

    // 2) Buscar IDs relevantes en UNA query (incluye vistos mediante id = ANY($3))
    let idsResult: { id: string }[] = [];

    if (tsQuery) {
      idsResult = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT id
        FROM "Product"
        WHERE status = 'publicado'
          AND (
            search_vector @@ to_tsquery('spanish', $1)
            OR similarity(LOWER("name"), LOWER($2)) > 0.2
            OR similarity(LOWER("brand"), LOWER($2)) > 0.2
            OR similarity(LOWER("model"), LOWER($2)) > 0.2
            OR similarity(LOWER("oemNumber"), LOWER($2)) > 0.2
            OR id = ANY($3)
          )
        ORDER BY
          GREATEST(
            similarity(LOWER("name"), LOWER($2)),
            similarity(LOWER("brand"), LOWER($2)),
            similarity(LOWER("model"), LOWER($2)),
            similarity(LOWER("oemNumber"), LOWER($2))
          ) DESC,
          ts_rank_cd(search_vector, to_tsquery('spanish', $1)) DESC
        LIMIT $4;
      `,
        tsQuery,
        plain,
        viewedIds,
        limit
      );
    } else {
      // fallback: sin tsquery, usar similarity + vistos
      idsResult = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT id
        FROM "Product"
        WHERE status = 'publicado'
          AND (
            similarity(LOWER("name"), LOWER($1)) > 0.2
            OR similarity(LOWER("brand"), LOWER($1)) > 0.2
            OR similarity(LOWER("model"), LOWER($1)) > 0.2
            OR similarity(LOWER("oemNumber"), LOWER($1)) > 0.2
            OR id = ANY($2)
          )
        ORDER BY
          GREATEST(
            similarity(LOWER("name"), LOWER($1)),
            similarity(LOWER("brand"), LOWER($1)),
            similarity(LOWER("model"), LOWER($1)),
            similarity(LOWER("oemNumber"), LOWER($1))
          ) DESC
        LIMIT $3;
      `,
        plain,
        viewedIds,
        limit
      );
    }

    const ids = idsResult.map((r) => r.id);
    if (ids.length === 0) return [];

    // 3) Traer productos completos con favorites
    const fullProducts = await prisma.product.findMany({
      where: { id: { in: ids }, status: "publicado" },
      include: {
        favorites: { where: { userId }, select: { id: true } },
      },
    });

    const byId = new Map(fullProducts.map((p) => [p.id, p]));
    const favoriteSet = new Set(
      fullProducts.filter((p) => p.favorites?.length).map((p) => p.id)
    );

    // 4) Mantener orden y devolver
    return ids
      .map((id) => {
        const p = byId.get(id);
        if (!p) return null;
        return { ...p, isFavorite: favoriteSet.has(id) };
      })
      .filter(Boolean) as (Product & { isFavorite: boolean })[];
  } catch (error) {
    console.error("getRecommendedProductsForUser error:", error);
    return [];
  }
}

/**
 * Funcion para traer los productos por filtro
 * @param filters Como parametro recibimos los filtros
 * @returns retornamos los productos con paginacion ya filtrados y contadores de filtros
 */
export const getProductsByFilterAction = async (filters: ProductFilter) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const {
      page = 1,
      limit = 20,
      orderBy = "createdAt",
      orderDirection = "desc",
    } = filters;

    const where: any = {
      status: "publicado",
    };

    // --------------------------
    // Filtros dinámicos
    // --------------------------
    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { brand: { contains: filters.query, mode: "insensitive" } },
        { model: { contains: filters.query, mode: "insensitive" } },
        { oemNumber: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    if (filters.categoria && filters.subcategoria) {
      where.AND = [
        { category: filters.categoria },
        { subcategory: filters.subcategoria },
      ];
    } else if (filters.categoria) {
      where.category = filters.categoria;
    } else if (filters.subcategoria) {
      where.subcategory = filters.subcategoria;
    }

    if (filters.oem) where.oemNumber = filters.oem;
    if (filters.marca)
      where.brand = { contains: filters.marca, mode: "insensitive" };
    if (filters.modelo)
      where.model = { contains: filters.modelo, mode: "insensitive" };

    if (filters.estado) {
      if (Array.isArray(filters.estado)) {
        where.condition = { in: filters.estado };
      } else {
        where.condition = filters.estado;
      }
    }

    if (filters.año) where.year = filters.año;
    if (filters.tipoDeVehiculo) where.tipoDeVehiculo = filters.tipoDeVehiculo;

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.OR = [
        {
          offer: true,
          offerPrice: {
            ...(filters.priceMin !== undefined && {
              gte: filters.priceMin.toString(),
            }),
            ...(filters.priceMax !== undefined && {
              lte: filters.priceMax.toString(),
            }),
          },
        },
        {
          offer: false,
          price: {
            ...(filters.priceMin !== undefined && {
              gte: filters.priceMin.toString(),
            }),
            ...(filters.priceMax !== undefined && {
              lte: filters.priceMax.toString(),
            }),
          },
        },
      ];
    }

    // --------------------------
    // Conteo total para paginación
    // --------------------------
    const total = await prisma.product.count({ where });

    // --------------------------
    // Contadores por condición (condition)
    // --------------------------
    const conditionCountsRaw = await prisma.product.groupBy({
      by: ["condition"],
      where, // aplica todos los filtros excepto 'estado'
      _count: { condition: true },
    });

    const conditionCounts = conditionCountsRaw.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.condition]: curr._count.condition,
      }),
      {}
    );

    // --------------------------
    // Traer productos
    // --------------------------
    const productsRaw = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    const now = new Date();

    // --------------------------
    // Ordenar: destacados arriba
    // --------------------------
    const products = productsRaw.sort((a, b) => {
      const aFeatured = a.featuredUntil && a.featuredUntil >= now ? 1 : 0;
      const bFeatured = b.featuredUntil && b.featuredUntil >= now ? 1 : 0;

      if (aFeatured !== bFeatured) return bFeatured - aFeatured;

      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === bValue) return 0;
      if (orderDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    // --------------------------
    // Retorno final
    // --------------------------
    return {
      total,
      page,
      limit,
      products: products.map((p) => ({
        ...p,
        isFavorite: userId ? p.favorites.length > 0 : false,
      })),
      counts: {
        condition: conditionCounts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      total: 0,
      page: 1,
      limit: 20,
      products: [],
      counts: {
        condition: {},
      },
    };
  }
};

// Obtener todos los productos favoritos del usuario
export const getFavoriteProductsAction = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return [];

    const products = await prisma.product.findMany({
      where: {
        status: "publicado",
        favorites: {
          some: { userId },
        },
      },
      include: {
        favorites: { where: { userId }, select: { id: true } },
      },
    });

    return products.map((p) => ({
      ...p,
      isFavorite: true, // si entró acá, ya es favorito
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Funciones para obtener productos teniendo encuenta el id del producto
 */

// Obtener producto por id
export const getProductByIdAction = async (id: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!product) {
      return { error: "El producto no existe" };
    }

    return {
      ...product,
      isFavorite: userId ? product.favorites.length > 0 : false,
    };
  } catch (error) {
    console.log(error);
    return { error: "Error al obtener el producto" };
  }
};

/**
 * Obtiene hasta 10 productos similares al producto actual.
 * Se basa en coincidencias de categoría, marca, modelo, tipoDeVehiculo y condición.
 * No incluye el mismo producto y solo devuelve productos publicados.
 * Prioriza productos destacados vigentes (featuredUntil >= now) y agrega favoritos si el usuario está autenticado.
 */
export async function getRecommendedProductsByProductId(
  productId: string,
  userId?: string,
  limit = 10
) {
  const now = new Date();

  // 1️⃣ Buscar el producto actual
  const baseProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!baseProduct) return [];

  // 2️⃣ Buscar productos similares
  const productsRaw = await prisma.product.findMany({
    where: {
      id: { not: productId },
      status: "publicado",
      OR: [
        { category: baseProduct.category },
        { subcategory: baseProduct.subcategory ?? undefined },
        { brand: baseProduct.brand },
        { model: baseProduct.model },
        { tipoDeVehiculo: baseProduct.tipoDeVehiculo },
        { condition: baseProduct.condition },
      ],
    },
    include: {
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
    orderBy: { createdAt: "desc" },
    take: limit * 3,
  });

  // 3️⃣ Ordenar destacados primero
  const recommended = productsRaw
    .sort((a, b) => {
      const aFeatured = a.featuredUntil && a.featuredUntil >= now ? 1 : 0;
      const bFeatured = b.featuredUntil && b.featuredUntil >= now ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, limit)
    .map((p) => ({
      ...p,
      isFavorite: userId ? p.favorites.length > 0 : false,
    }));

  return recommended;
}

/**
 * Obtener hasta 10 productos del mismo vendedor.
 * Excluye el producto original y prioriza destacados vigentes.
 * Incluye información de favoritos si el usuario está autenticado.
 */
export async function getRelatedProducts(
  productId: string,
  vendedorId: string,
  userId?: string
) {
  const now = new Date();

  // 1️⃣ Traer productos del mismo vendedor
  const productsRaw = await prisma.product.findMany({
    where: {
      vendorId: vendedorId,
      id: { not: productId },
      status: "publicado",
    },
    include: {
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  // 2️⃣ Ordenar destacados y mapear favoritos
  const products = productsRaw
    .sort((a, b) => {
      const aFeatured = a.featuredUntil && a.featuredUntil >= now ? 1 : 0;
      const bFeatured = b.featuredUntil && b.featuredUntil >= now ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, 10)
    .map((p) => ({
      ...p,
      isFavorite: userId ? p.favorites.length > 0 : false,
    }));

  return products;
}

/**
 * Funcion para obtener la informacion de un vendedor para la tienda
 * @param userId id del vendedor
 * @param page numero de pagina
 * @param limit limite de objectos
 * @returns Retorna la lista de productos, informacion del vendedor y la paginacion
 */
export const getVendedorProductsAndInfo = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<VendedorResType> => {
  try {
    const session = await auth();

    if (!userId) {
      return { user: null, products: [], total: 0, page: 1, limit };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { user: null, products: [], total: 0, page: 1, limit };
    }

    // conteo total de productos del vendedor
    const total = await prisma.product.count({
      where: { vendorId: userId },
    });

    // productos paginados
    const products = await prisma.product.findMany({
      where: { status: "publicado", vendorId: userId },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
      orderBy: { createdAt: "desc" }, // opcional, para orden
    });

    return {
      user,
      products: products.map((p) => ({
        ...p,
        isFavorite: session?.user.id ? p.favorites.length > 0 : false,
      })),
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error(error);
    return { user: null, products: [], total: 0, page: 1, limit };
  }
};

/**
 *  Action para incrementar clicks de un producto
 */
export async function incrementClicksProduct(productId: string) {
  const product = await prisma.product.update({
    where: { id: productId },
    data: { clicks: { increment: 1 } },
  });

  if (!product) return { success: false };

  return { success: true };
}

/**
 * Action para registrar el producto que vio el usuario
 */
export async function registerUserProductView(
  userId: string,
  productId: string
) {
  if (!userId) return;

  const view = await prisma.userProductView.upsert({
    where: { userId_productId: { userId, productId } },
    update: { viewedAt: new Date() }, // si ya existe, actualiza
    create: { userId, productId }, // si no existe, lo crea
  });
}

/**
 * Traer toda la informacion de la tienda
 */
export async function getVendorResponseAnalytics(vendorId: string) {
  // Traemos los mensajes de todas las salas del vendedor
  const rooms = await prisma.room.findMany({
    where: { vendorId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          senderId: true,
          createdAt: true,
        },
      },
    },
  });

  let totalResponseTime = 0;
  let totalResponses = 0;

  // Analizamos cada sala del vendedor
  for (const room of rooms) {
    const { messages } = room;
    let lastBuyerMessage: Date | null = null;

    for (const msg of messages) {
      const isBuyer = msg.senderId === room.buyerId;
      const isVendor = msg.senderId === room.vendorId;

      // Guardamos el momento del último mensaje del comprador
      if (isBuyer) {
        lastBuyerMessage = msg.createdAt;
      }

      // Cuando el vendedor responde, calculamos la diferencia de tiempo
      if (isVendor && lastBuyerMessage) {
        const diffMs = msg.createdAt.getTime() - lastBuyerMessage.getTime();
        totalResponseTime += diffMs;
        totalResponses++;
        lastBuyerMessage = null; // Reiniciamos para la próxima interacción
      }
    }
  }

  if (totalResponses === 0) {
    return {
      averageMinutes: null,
      message: "No hay respuestas registradas aún",
    };
  }

  // Promedio en minutos
  const averageMinutes = totalResponseTime / totalResponses / 1000 / 60;

  return {
    vendorId,
    averageMinutes,
    responses: totalResponses,
  };
}
