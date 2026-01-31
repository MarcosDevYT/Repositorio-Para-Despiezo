"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import {
  getProductsByFilterAction,
  getFeaturedProducts,
  getPopularProductsFromSearchLogs,
  getProductsAction,
  getProductByIdAction,
  calculateProductAndDispatchMetrics,
  calculateSalesMetrics,
  registerUserProductView,
  getRelatedProducts,
  getRecommendedProductsByProductId,
} from "@/actions/sell-actions";
import { getKitsByProductId } from "@/actions/kit-actions";
import { getUserAction } from "@/actions/user-actions";
import { redis } from "@/lib/redis";

/**
 * CACHE QUERIES (Internal)
 */

const getProductByIdQuery = unstable_cache(
  async (id: string) => await getProductByIdAction(id),
  ["product-detail"],
  { revalidate: 3600, tags: ["products"] }
);

const getProductsByFilterQuery = unstable_cache(
  async (filters: any) => await getProductsByFilterAction(filters),
  ["products-search"],
  { revalidate: 3600, tags: ["products", "search"] }
);

const getRelatedProductsQuery = unstable_cache(
  async (productId: string, vendedorId: string, userId?: string) =>
    await getRelatedProducts(productId, vendedorId, userId),
  ["related-products"],
  { revalidate: 3600, tags: ["products", "related"] }
);

const getRecommendedProductsQuery = unstable_cache(
  async (productId: string, userId?: string) =>
    await getRecommendedProductsByProductId(productId, userId),
  ["recommended-products"],
  { revalidate: 3600, tags: ["products", "recommended"] }
);

const getKitsByProductIdQuery = unstable_cache(
  async (productId: string) => await getKitsByProductId(productId),
  ["kits-by-product"],
  { revalidate: 3600, tags: ["products", "kits"] }
);

const getUserQuery = unstable_cache(
  async (userId: string) => await getUserAction(userId),
  ["user-detail"],
  { revalidate: 3600, tags: ["users"] }
);

const getFeaturedProductsQuery = unstable_cache(
  async () => await getFeaturedProducts(),
  ["featured-products"],
  { revalidate: 3600, tags: ["products", "featured"] }
);

const getPopularProductsQuery = unstable_cache(
  async () => await getPopularProductsFromSearchLogs(),
  ["popular-products"],
  { revalidate: 3600, tags: ["products", "popular"] }
);

const getProductsQuery = unstable_cache(
  async () => await getProductsAction(),
  ["recent-products"],
  { revalidate: 3600, tags: ["products", "recent"] }
);

/**
 * EXPORTED SERVER ACTIONS (Must be async)
 */

export async function getProductByIdCached(id: string) {
  return getProductByIdQuery(id);
}

export async function getProductsByFilterCached(filters: any) {
  // Generamos una llave única serializando los filtros.
  // Importante: El orden de las propiedades importa para el JSON.stringify
  const filterKey = JSON.stringify(filters);
  
  return unstable_cache(
    async (f: any) => {
      const result = await getProductsByFilterAction(f);
      return result;
    },
    ["products-search", filterKey],
    { revalidate: 3600, tags: ["products", "search"] }
  )(filters);
}

export async function getRelatedProductsCached(productId: string, vendedorId: string, userId?: string) {
  return getRelatedProductsQuery(productId, vendedorId, userId);
}

export async function getRecommendedProductsByProductIdCached(productId: string, userId?: string) {
  return getRecommendedProductsQuery(productId, userId);
}

export async function getKitsByProductIdCached(productId: string) {
  return getKitsByProductIdQuery(productId);
}

export async function getUserCached(userId: string) {
  return getUserQuery(userId);
}

export async function getFeaturedProductsCached() {
  return getFeaturedProductsQuery();
}

export async function getPopularProductsCached() {
  return getPopularProductsQuery();
}

export async function getProductsCached() {
  return getProductsQuery();
}

/**
 * Registra la vista de un producto de forma optimizada (No cacheable, solo wrapper)
 */
export async function registerUserProductViewCached(userId: string, productId: string) {
  return await registerUserProductView(userId, productId);
}

/**
 * Obtiene y actualiza las analíticas del vendedor. (Usa Redis manual)
 */
export async function getVendorAnalytics(vendorId: string) {
  if (!vendorId) return null;

  const cacheKey = `vendor:${vendorId}:analytics`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [productMetrics, salesMetrics] = await Promise.all([
    calculateProductAndDispatchMetrics(vendorId),
    calculateSalesMetrics(vendorId),
  ]);

  const analytics = await prisma.vendorAnalytics.upsert({
    where: { vendorId },
    update: {
      ...productMetrics,
      ...salesMetrics,
      calculatedAt: new Date(),
    },
    create: {
      vendorId,
      ...productMetrics,
      ...salesMetrics,
    },
  });

  await redis.set(cacheKey, JSON.stringify(analytics), "EX", 3600);
  return analytics;
}
