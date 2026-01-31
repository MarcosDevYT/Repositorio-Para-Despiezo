"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { prisma } from "@/lib/prisma";
import { buildTsQueryFromQueries, getYearsFromRange } from "@/lib/utils";
import { Product } from "@prisma/client";

type ProductFilter = {
  query?: string; // nombre o descripción
  categoria?: string; // slug categoría
  subcategoria?: string; // slug subcategoría
  oem?: string; // OEM number
  marca?: string; // brand
  modelo?: string; // modelo
  estado?: string; // condition
  año?: string | string[]; // año del vehículo
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

    // Revalidar el cache global de productos y búsquedas
    revalidateTag("products");
    revalidatePath("/", "layout");
    revalidatePath("/productos", "layout");
    revalidatePath("/(routes)/productos/[id]", "layout");

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

    // Revalidar el cache global de productos y búsquedas
    revalidateTag("products");
    revalidateTag(`product-${id}`);
    revalidatePath("/", "layout");
    revalidatePath("/productos", "layout");
    revalidatePath(`/productos/${id}`);

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

    // Revalidar el cache global de productos y búsquedas
    revalidateTag("products");
    revalidateTag(`product-${id}`);
    revalidatePath("/", "layout");
    revalidatePath("/productos", "layout");
    revalidatePath(`/productos/${id}`);

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
      orderBy: [
        {
          status: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return products;
  } catch (error) {
    console.log(error);
    return {
      error: "Error al obtener los productos",
    };
  }
};

// Obtener los productos del usuario disponibles
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
        // Verificar que este con estado "publicado"
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
 * Ultimos productos, Productos Desctacados y productos populares con cache
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

/**
 * Obtiene los productos destacados vigentes
 * @param limit Cantidad de productos a traer (default = 10)
 */
export async function getFeaturedProducts(userId?: string) {
  const featured = await prisma.product.findMany({
    where: {
      status: "publicado",
      featuredUntil: { gte: new Date() },
    },
    orderBy: { featuredAt: "desc" },
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
    // 1️ Obtener top 5 términos más buscados
    const logs = await prisma.searchLog.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
      select: { query: true },
    });

    // 2️ Obtener top 5 productos más cliqueados
    const topClickedProducts = await prisma.product.findMany({
      where: { status: "publicado" },
      orderBy: { clicks: "desc" },
      take: 5,
      select: { id: true, name: true, brand: true, model: true },
    });

    // Si no hay nada popular aún
    if (logs.length === 0 && topClickedProducts.length === 0) return [];

    // 3️ Combinar consultas del search log + nombres de productos más cliqueados
    const combinedQueries = [
      ...logs.map((l) => (l.query || "").trim()),
      ...topClickedProducts.map((p) =>
        [p.name, p.brand, p.model].filter(Boolean).join(" ")
      ),
    ].filter(Boolean);

    if (combinedQueries.length === 0) return [];

    const { tsQuery, plain } = buildTsQueryFromQueries(combinedQueries);

    // 4️ Buscar productos populares por similitud o relevancia semántica
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

    // 5️ Traer productos completos + favoritos
    const fullProducts = await prisma.product.findMany({
      where: { id: { in: ids }, status: "publicado" },
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    // 6️ Mantener orden de popularidad y añadir isFavorite
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
 * Productos sin cache para el home
 * Ultimos productos vistos, prouctos recomendados
 *
 */

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
 *
 *
 * Productos por filtro para la pagina de todos los productos
 *
 */

/**
 * Funcion para traer los productos por filtro
 * @param filters Como parametro recibimos los filtros
 * @returns retornamos los productos con paginacion ya filtrados y contadores de filtros
 */
export const getProductsByFilterAction = async (filters: ProductFilter) => {
  try {
    const {
      page = 1,
      limit = 20,
      orderBy = "createdAt",
      orderDirection = "desc",
    } = filters;

    const andConditions: any[] = [{ status: "publicado" }];

    // --------------------------
    // Filtros dinámicos
    // --------------------------
    if (filters.query && filters.query.trim() !== "") {
      andConditions.push({
        OR: [
          { name: { contains: filters.query, mode: "insensitive" } },
          { description: { contains: filters.query, mode: "insensitive" } },
          { brand: { contains: filters.query, mode: "insensitive" } },
          { model: { contains: filters.query, mode: "insensitive" } },
          { oemNumber: { contains: filters.query, mode: "insensitive" } },
        ],
      });
    }

    if (filters.categoria && filters.categoria.trim() !== "") {
      andConditions.push({ category: filters.categoria });
    }

    if (filters.subcategoria && filters.subcategoria.trim() !== "") {
      andConditions.push({ subcategory: filters.subcategoria });
    }

    if (filters.oem && filters.oem.trim() !== "") {
      andConditions.push({ oemNumber: filters.oem });
    }

    if (filters.marca && filters.marca.trim() !== "") {
      andConditions.push({ brand: { contains: filters.marca, mode: "insensitive" } });
    }

    if (filters.modelo && filters.modelo.trim() !== "") {
      andConditions.push({ model: { contains: filters.modelo, mode: "insensitive" } });
    }

    if (filters.estado) {
      if (Array.isArray(filters.estado) && filters.estado.length > 0) {
        andConditions.push({ condition: { in: filters.estado } });
      } else if (typeof filters.estado === "string" && filters.estado.trim() !== "") {
        andConditions.push({ condition: filters.estado });
      }
    }

    if (filters.año) {
      const yearValues = Array.isArray(filters.año)
        ? filters.año.flatMap((y) => getYearsFromRange(y))
        : getYearsFromRange(filters.año);

      if (yearValues.length > 0) {
        andConditions.push({ year: { in: yearValues } });
      }
    }

    if (filters.tipoDeVehiculo && filters.tipoDeVehiculo.trim() !== "") {
      andConditions.push({ tipoDeVehiculo: filters.tipoDeVehiculo });
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      andConditions.push({
        OR: [
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
        ],
      });
    }

    const where = { AND: andConditions };

    // --------------------------
    // Conteo total para paginación
    // --------------------------
    const total = await prisma.product.count({ where });

    // --------------------------
    // Contadores por condición (condition)
    // --------------------------
    const conditionCountsRaw = await prisma.product.groupBy({
      by: ["condition"],
      where, 
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
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          featuredUntil: {
            sort: "desc",
            nulls: "last",
          },
        },
        {
          [orderBy]: orderDirection,
        },
      ],
    });

    // --------------------------
    // Retorno final
    // --------------------------
    return {
      total,
      page,
      limit,
      products: JSON.parse(JSON.stringify(products)), // Asegurar serialización para cache
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

// Obtener producto por id (Versión base para cache)
export const getProductByIdAction = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { error: "El producto no existe" };
    }

    // Obtener compatibilidades OEM basadas en el oemNumber del producto
    let oemCompatibilidades: any[] = [];
    if (product.oemNumber) {
      const oemPieza = await prisma.oemPieza.findUnique({
        where: { oem: product.oemNumber.toUpperCase() },
        include: {
          compatibilidades: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      oemCompatibilidades = oemPieza?.compatibilidades || [];
    }

    return {
      ...product,
      oemCompatibilidades,
    };
  } catch (error) {
    console.log(error);
    return { error: "Error al obtener el producto" };
  }
};

// Obtener estado de favorito de un producto para un usuario
export const getProductFavoriteStatus = async (productId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return false;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    return false;
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

  await prisma.userProductView.upsert({
    where: { userId_productId: { userId, productId } },
    update: { viewedAt: new Date() }, // si ya existe, actualiza
    create: { userId, productId }, // si no existe, lo crea
  });
}

/**
 * Obtiene los productos de un vendedor con paginación y conteos básicos.
 */
export async function getVendorProductsPaginated(
  vendorId: string,
  page = 1,
  limit = 20
) {
  try {
    if (!vendorId) return null;

    const session = await auth();

    // 🔹 Obtener productos + conteos en paralelo
    const [productCounts, products] = await Promise.all([
      prisma.product.groupBy({
        by: ["status"],
        where: { vendorId },
        _count: { _all: true },
      }),

      prisma.product.findMany({
        where: { vendorId, status: "publicado" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          favorites: session?.user?.id
            ? { where: { userId: session.user.id }, select: { id: true } }
            : false,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // 🔹 Calcular conteos básicos
    const total = productCounts.reduce((sum, c) => sum + c._count._all, 0);
    const publicados =
      productCounts.find((c) => c.status === "publicado")?._count._all || 0;
    const vendidos =
      productCounts.find((c) => c.status === "vendido")?._count._all || 0;
    const noVendidos = total - vendidos;

    // 🔹 Transformar productos con favoritos
    const mappedProducts = products.map((p) => ({
      ...p,
      isFavorite: session?.user?.id ? p.favorites.length > 0 : false,
    }));

    const result = {
      products: mappedProducts,
      counts: { total, publicados, vendidos, noVendidos },
      pagination: { page, limit },
    };

    return result;
  } catch (error) {
    console.error("❌ Error en getVendorProductsPaginated:", error);
    return null;
  }
}

/**
 * Función para calcular métricas de productos y despacho
 */
export async function calculateProductAndDispatchMetrics(vendorId: string) {
  const [productCounts, rooms, orders] = await Promise.all([
    prisma.product.groupBy({
      by: ["status"],
      where: { vendorId },
      _count: { _all: true },
    }),
    prisma.room.findMany({
      where: { vendorId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 20,
          select: { senderId: true, createdAt: true },
        },
      },
    }),
    prisma.orden.findMany({
      where: { vendorId, despachadoAt: { not: null } },
      select: { createdAt: true, despachadoAt: true },
    }),
  ]);

  // Conteos básicos
  const total = productCounts.reduce((sum, c) => sum + c._count._all, 0);
  const publicados =
    productCounts.find((c) => c.status === "publicado")?._count._all || 0;
  const vendidos =
    productCounts.find((c) => c.status === "vendido")?._count._all || 0;
  const noVendidos = total - vendidos;

  // Promedio de tiempo de respuesta
  let totalResponseTime = 0;
  let totalResponses = 0;

  for (const room of rooms) {
    let lastBuyerMessage: Date | null = null;

    for (const msg of room.messages) {
      const isBuyer = msg.senderId === room.buyerId;
      const isVendor = msg.senderId === room.vendorId;

      if (isBuyer) lastBuyerMessage = msg.createdAt;
      if (isVendor && lastBuyerMessage) {
        totalResponseTime +=
          msg.createdAt.getTime() - lastBuyerMessage.getTime();
        totalResponses++;
        lastBuyerMessage = null;
      }
    }
  }

  const avgResponseMin =
    totalResponses > 0 ? totalResponseTime / totalResponses / 1000 / 60 : null;

  // Métricas de despacho
  const totalDispatches = orders.length;
  const hasDispatched = totalDispatches > 0;

  let totalDays = 0;
  for (const o of orders) {
    if (o.despachadoAt)
      totalDays +=
        (o.despachadoAt.getTime() - o.createdAt.getTime()) /
        (1000 * 60 * 60 * 24);
  }

  const avgDispatchDays = hasDispatched ? totalDays / totalDispatches : null;
  const isFastShipper =
    hasDispatched && !!avgDispatchDays && avgDispatchDays <= 5;

  return {
    totalProducts: total,
    publicados,
    vendidos,
    noVendidos,
    avgResponseMin,
    hasDispatched,
    totalDispatches,
    avgDispatchDays,
    isFastShipper,
  };
}

/**
 * Importar productos masivamente desde CSV
 */
export async function importCSVProductsAction(
  products: Array<{
    name: string;
    description: string;
    oemNumber: string;
    price: string;
    brand: string;
    model: string;
    year: string;
    tipoDeVehiculo: "coche" | "moto" | "furgoneta";
    condition: string;
    typeOfPiece: string;
    weight: string;
    length: string;
    width: string;
    height: string;
    location: string;
    offer: string;
    offerPrice?: string;
    images: string[];
    category: string;
    subcategory?: string;
  }>
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    // Verificar que el usuario sea Pro
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { products: true },
    });

    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    if (!user.pro) {
      return {
        error:
          "Esta funcionalidad es exclusiva para usuarios Pro. Actualiza tu cuenta para continuar.",
      };
    }

    // Filtrar solo productos que NO estén vendidos
    const activeProducts = user.products.filter(
      (product) => product.status !== "vendido"
    );

    // Verificar límite (aunque sea Pro, podemos tener un límite razonable)
    const remainingSlots = user.pro ? 1000 : 40 - activeProducts.length;

    if (products.length > remainingSlots) {
      return {
        error: `Solo puedes importar ${remainingSlots} productos más. Tienes ${activeProducts.length} productos activos.`,
      };
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    // Importar productos uno por uno
    for (const product of products) {
      try {
        // Transformar datos
        const productData = {
          name: product.name,
          description: product.description,
          oemNumber: product.oemNumber,
          price: product.price,
          brand: product.brand,
          model: product.model,
          year: product.year,
          tipoDeVehiculo: product.tipoDeVehiculo,
          condition: product.condition,
          typeOfPiece: product.typeOfPiece,
          weight: Number.parseFloat(product.weight),
          length: Number.parseFloat(product.length),
          width: Number.parseFloat(product.width),
          height: Number.parseFloat(product.height),
          location: product.location,
          offer: product.offer === "true" || product.offer === "1",
          offerPrice: product.offerPrice || null,
          images: product.images,
          category: product.category,
          subcategory: product.subcategory || null,
          status: "publicado" as const,
          vendorId: session.user.id,
        };

        // Crear producto
        await prisma.product.create({
          data: productData,
        });

        imported++;
      } catch (error) {
        failed++;
        const errorMsg =
          error instanceof Error ? error.message : "Error desconocido";
        errors.push(`${product.name}: ${errorMsg}`);
        console.error(`Error al importar producto ${product.name}:`, error);
      }
    }

    // Retornar resultado
    if (imported === 0) {
      return {
        error: `No se pudo importar ningún producto. Errores: ${errors.join(
          ", "
        )}`,
      };
    }

    return {
      success: true,
      imported,
      failed,
      errors: failed > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error("Error en importCSVProductsAction:", error);
    return {
      error:
        error instanceof Error ? error.message : "Error al importar productos",
    };
  }
}

/**
 *  Función para calcular métricas de ventas
 */
export async function calculateSalesMetrics(vendorId: string) {
  // Obtener todas las órdenes relevantes
  const orders = await prisma.orden.findMany({
    where: {
      vendorId,
      status: { in: ["paid", "shipped", "delivered", "completed"] },
    },
    include: { items: true },
  });

  const hasSales = orders.length > 0;
  const totalOrders = orders.length;
  const totalEarnings = orders.reduce((sum, o) => sum + o.vendorAmount, 0);

  const totalProductsSold = orders.reduce((sum, o) => sum + o.items.length, 0);
  const avgEarningsPerOrder = totalOrders ? totalEarnings / totalOrders : null;
  const avgProductPrice = totalProductsSold
    ? totalEarnings / totalProductsSold
    : null;

  // Ventas últimos 30 días
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentOrders = orders.filter((o) => o.createdAt >= last30Days);
  const earningsLast30Days = recentOrders.reduce(
    (sum, o) => sum + o.vendorAmount,
    0
  );
  const ordersLast30Days = recentOrders.length;
  const avgEarningsLast30Days = earningsLast30Days / 30;
  const isActiveSeller = ordersLast30Days > 0;

  // Calcular reviews del vendedor
  const reviews = await prisma.review.findMany({
    where: { vendorId },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  await prisma.user.update({
    where: { id: vendorId },
    data: {
      averageRating,
      totalReviews,
    },
  });

  return {
    hasSales,
    totalOrders,
    totalProductsSold,
    totalEarnings,
    avgEarningsPerOrder,
    avgProductPrice,
    earningsLast30Days,
    ordersLast30Days,
    avgEarningsLast30Days,
    isActiveSeller,
    averageRating,
    totalReviews,
  };
}
