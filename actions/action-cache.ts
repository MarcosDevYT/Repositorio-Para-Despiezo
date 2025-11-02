import { unstable_cache } from "next/cache";
import {
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
