"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { redis } from "@/lib/redis";
import {
  calculateProductAndDispatchMetrics,
  calculateSalesMetrics,
  getFeaturedProducts,
  getPopularProductsFromSearchLogs,
  getProductsAction,
} from "@/actions/sell-actions";

// Cachea los productos destacados por 600 segundos
// Si no encuentra productos, retorna array vacío
export const getFeaturedProductsCached = unstable_cache(
  async () => {
    const products = await getFeaturedProducts();
    return products ?? [];
  },
  ["featured-products"],
  { revalidate: 600 },
);

// Cachea los productos populares
// Si no encuentra productos, retorna array vacío
export const getPopularProductsCached = unstable_cache(
  async () => {
    const products = await getPopularProductsFromSearchLogs();
    return products ?? [];
  },
  ["popular-products"],
  { revalidate: 600 },
);

// Cachea los productos recientes
// Si no encuentra productos, retorna array vacío
export const getProductsCached = unstable_cache(
  async () => {
    const products = await getProductsAction();
    return products ?? [];
  },
  ["recent-products"],
  { revalidate: 600 },
);

/**
 * Helper para obtener de Redis de forma segura
 * Si Redis no está disponible, retorna null sin lanzar error
 */
async function safeRedisGet(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch (error) {
    console.warn(`[Redis] Error al obtener cache key "${key}":`, error);
    return null;
  }
}

/**
 * Helper para guardar en Redis de forma segura
 * Si Redis no está disponible, simplemente no guarda sin lanzar error
 */
async function safeRedisSet(
  key: string,
  value: string,
  expirationSeconds: number,
): Promise<void> {
  try {
    await redis.set(key, value, "EX", expirationSeconds);
  } catch (error) {
    console.warn(`[Redis] Error al guardar cache key "${key}":`, error);
  }
}

/**
 * Obtiene y actualiza las analíticas del vendedor.
 * Si no existe en cache ni en DB, crea un nuevo registro.
 * Incluye métricas como tiempos de respuesta, despacho y conteos de productos.
 * Si Redis no está disponible, continúa funcionando sin cache.
 */
export async function getVendorAnalytics(vendorId: string) {
  if (!vendorId) return null;

  const cacheKey = `vendor:${vendorId}:analytics`;

  // Intenta obtener del cache de forma segura
  const cached = await safeRedisGet(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Si el cache está corrupto, continúa para recalcular
    }
  }

  // Calcula las métricas (esto siempre genera datos, incluso si son vacíos/cero)
  const [productMetrics, salesMetrics] = await Promise.all([
    calculateProductAndDispatchMetrics(vendorId),
    calculateSalesMetrics(vendorId),
  ]);

  // Upsert: actualiza si existe, crea si no existe
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
      calculatedAt: new Date(),
    },
  });

  // Guarda en cache por 1 hora (de forma segura, sin fallar si Redis no está disponible)
  await safeRedisSet(cacheKey, JSON.stringify(analytics), 60 * 60);

  return analytics;
}
