"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { redis } from "@/lib/redis";
import {
  calculateProductAndDispatchMetrics,
  calculateSalesMetrics,
  getFeaturedProducts,
  getPopularProductsFromSearchLogs,
  getProductsAction,
} from "@/actions/sell-actions";

// Cachea los productos destacados por 60 segundos
export const getFeaturedProductsCached = unstable_cache(
  async () => await getFeaturedProducts(),
  ["featured-products"], // clave de cache
  { revalidate: 600 } // segundos hasta revalidar
);

// Cachea los productos populares
export const getPopularProductsCached = unstable_cache(
  async () => await getPopularProductsFromSearchLogs(),
  ["popular-products"],
  { revalidate: 600 }
);

// Cachea los productos recientes
export const getProductsCached = unstable_cache(
  async () => await getProductsAction(),
  ["recent-products"],
  { revalidate: 600 }
);

/**
 * Obtiene y actualiza las analíticas del vendedor.
 * Incluye métricas como tiempos de respuesta, despacho y conteos de productos.
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

  await redis.set(cacheKey, JSON.stringify(analytics), "EX", 60 * 60);
  return analytics;
}
