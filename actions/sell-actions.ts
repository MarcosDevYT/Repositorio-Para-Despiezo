"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { prisma } from "@/lib/prisma";
import { Product, User } from "@prisma/client";

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
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Validar los datos del formulario
    const validatedData = sellSchema.parse(data);

    console.log("Datos validados", validatedData);

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        vendorId: session.user.id,
      },
    });

    console.log("Producto creado", product);

    return {
      success: "Producto creado correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error al crear el producto",
    };
  }
};

// Editar un producto
export async function updateProductAction(
  id: string,
  data: z.infer<typeof sellSchema>
) {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Validar los datos del formulario
    const validatedData = sellSchema.parse(data);

    console.log("Datos validados", validatedData);

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
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        error: "El producto no existe",
      };
    }

    // Verificar si el usuario es el dueño del producto
    if (product.vendorId !== session.user.id) {
      return {
        error: "No tienes permisos para eliminar este producto",
      };
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

/**
 * ACTIONS PARA
 * MOSTRAR LOS PRODUCTOS EN EL HOME
 * ULTIMOS, DESTACADOS, RECOMENDADOS, HISTORIAL, MAS BUSCADOS
 */

// Obtener todos los productos publicados
export const getProductsAction = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const products = await prisma.product.findMany({
      where: {
        status: "publicado", // 🔹 Solo productos publicados
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
    where: { userId },
    orderBy: { viewedAt: "desc" }, // lo más reciente primero
    take: 10,
    include: {
      product: true, // trae los datos del producto relacionado
    },
  });

  if (views.length === 0) {
    return [];
  }

  // Si solo te interesa el producto y no la metadata de la vista:
  return views.map((view) => view.product);
}

/**
 * Obtiene los productos destacados vigentes
 * @param limit Cantidad de productos a traer (default = 10)
 */
export async function getFeaturedProducts(limit = 10) {
  const featured = await prisma.product.findMany({
    where: {
      // solo los que aún no vencieron
      featuredUntil: { gte: new Date() },
    },
    // los más recientemente destacados primero
    orderBy: { featuredAt: "desc" },
    take: limit,
  });

  if (featured.length === 0) {
    return [];
  }

  return featured;
}

/**
 * Obtiene hasta `limit` productos (objetos Product completos) en base a los search logs más populares.
 * Devuelve un array plano de Product; si no hay resultados devuelve [].
 */
export async function getPopularProductsFromSearchLogs(
  limit = 10
): Promise<Product[]> {
  // 1) traer los 5 search logs más populares
  const logs = await prisma.searchLog.findMany({
    orderBy: { clicks: "desc" },
    take: 5,
  });

  if (!logs || logs.length === 0) return [];

  // ids únicos en orden de relevancia
  const idsOrdered: string[] = [];
  const seen = new Set<string>();

  for (const log of logs) {
    const query = (log.query || "").trim();
    if (!query) continue;

    const tsQuery = query
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(" & ");

    const productsPartial = await prisma.$queryRawUnsafe<any[]>(
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
      LIMIT $3;
    `,
      tsQuery,
      query,
      limit
    );

    for (const p of productsPartial) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      idsOrdered.push(p.id);
      if (idsOrdered.length >= limit) break;
    }

    if (idsOrdered.length >= limit) break;
  }

  if (idsOrdered.length === 0) return [];

  // 2) Traer los productos completos por ids
  const fullProducts = await prisma.product.findMany({
    where: { id: { in: idsOrdered } },
  });

  // 3) Mapear por id para reordenar según idsOrdered
  const byId = new Map(fullProducts.map((fp) => [fp.id, fp]));

  // Type guard para filtrar undefined y mantener el tipo Product
  const orderedProducts = idsOrdered
    .map((id) => byId.get(id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, limit);

  return orderedProducts;
}

/**
 * Obtiene hasta 10 productos recomendados para un usuario específico.
 *
 * - Si no se pasa userId, devuelve [].
 * - Usa las últimas búsquedas (`SearchHistory`) y productos vistos (`UserProductView`) del usuario.
 * - Devuelve productos completos (`Product[]`) en un array plano, máximo 10.
 * - Si no encuentra productos, devuelve [].
 */
export async function getRecommendedProductsForUser(
  userId?: string,
  limit = 10
): Promise<Product[]> {
  if (!userId) return [];

  // 1) Traer últimas búsquedas del usuario (máx 5)
  const searchLogs = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // 2) Traer últimos productos vistos por el usuario (máx 5)
  const viewedProducts = await prisma.userProductView.findMany({
    where: { userId },
    orderBy: { viewedAt: "desc" },
    take: 5,
    select: { productId: true },
  });

  const queries: string[] = searchLogs
    .map((s) => s.query.trim())
    .filter((q) => q);
  const productIdsFromViews = viewedProducts.map((v) => v.productId);

  if (queries.length === 0 && productIdsFromViews.length === 0) return [];

  const productsSet = new Map<string, Product>();

  // 3) Buscar productos por query (similar a full-text + similitud)
  for (const query of queries) {
    const tsQuery = query
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(" & ");

    const productsPartial = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT id, "name", "description", "price", "images", "oemNumber",
             "brand", "model", "year", "tipoDeVehiculo", "condition", "status",
             "typeOfPiece", "location", "category", "subcategory", "offer", "offerPrice",
             "weight", "length", "width", "height", "featuredUntil", "featuredAt",
             "clicks", "vendorId", "createdAt", "updatedAt",
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
      LIMIT $3;
    `,
      tsQuery,
      query,
      limit
    );

    for (const p of productsPartial) {
      if (!productsSet.has(p.id) && productsSet.size < limit) {
        productsSet.set(p.id, p);
      }
    }

    if (productsSet.size >= limit) break;
  }

  // 4) Agregar productos de vistas si aún no llegamos al límite
  for (const pid of productIdsFromViews) {
    if (!productsSet.has(pid) && productsSet.size < limit) {
      const prod = await prisma.product.findUnique({ where: { id: pid } });
      if (prod) productsSet.set(prod.id, prod);
    }
    if (productsSet.size >= limit) break;
  }

  // 5) Devolver productos como array completo, máximo `limit`
  return Array.from(productsSet.values()).slice(0, limit);
}

/**
 * Funcion para traer los productos por filtro
 * @param filters Como parametro recibimos los filtros
 * @returns retornamos los productos con paginacion ya filtrados
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

    // Búsqueda por texto en nombre o descripción
    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { brand: { contains: filters.query, mode: "insensitive" } },
        { model: { contains: filters.query, mode: "insensitive" } },
        { oemNumber: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    // Búsqueda combinada categoría + subcategoría
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

    if (filters.estado) where.condition = filters.estado;
    if (filters.año) where.year = filters.año;
    if (filters.tipoDeVehiculo) where.tipoDeVehiculo = filters.tipoDeVehiculo;

    // Filtrado por precio (recordar que price es string)
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

    // Conteo total para paginación
    const total = await prisma.product.count({ where });

    // Productos con paginación y orden
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderBy]: orderDirection },
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    return {
      total,
      page,
      limit,
      products: products.map((p) => ({
        ...p,
        isFavorite: userId ? p.favorites.length > 0 : false,
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      total: 0,
      page: 1,
      limit: 20,
      products: [],
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
