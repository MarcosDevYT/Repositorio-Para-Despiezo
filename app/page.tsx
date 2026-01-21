import { Hero } from "@/components/layout/home/Hero";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { Categories } from "@/components/layout/Categories/Categories";
import {
  getLastViewedProducts,
  getRecommendedProductsForUser,
} from "@/actions/sell-actions";
import { auth } from "@/auth";
import { FeaturedProducts } from "@/components/layout/home/FeaturedProducts";
import { MostSearchProducts } from "@/components/layout/home/MostSearchProducts";
import { HistoryProducts } from "@/components/layout/home/HistoryProducts";
import { RecommendedProducts } from "@/components/layout/home/RecommendedProducts";
import {
  getFeaturedProductsCached,
  getPopularProductsCached,
  getProductsCached,
} from "@/actions/action-cache";

export const dynamic = "auto";
export const revalidate = 600;

export default async function Home() {
  const session = await auth();
  const userId = session?.user.id;

  // datos dependientes de usuario — dinámicos
  const [lastProductView, recommendedProductsByUser] = await Promise.all([
    getLastViewedProducts(userId),
    getRecommendedProductsForUser(userId),
  ]);

  // datos cacheables globales con revalidación
  const [featuredProducts, popularProducts, products] = await Promise.all([
    getFeaturedProductsCached(),
    getPopularProductsCached(),
    getProductsCached(),
  ]);

  return (
    <MainContainer>
      {/* Barra de categorías con diseño mejorado */}
      <div className="sticky top-20 z-40 border-b bg-gradient-to-r from-muted/50 via-background to-muted/50 backdrop-blur-xl shadow-sm px-4 lg:px-12 py-3 w-full">
        <Categories />
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 lg:px-6 space-y-4">
        {/* Ultimos productos vistos */}
        <HistoryProducts products={lastProductView} />

        {/* Productos recomendados */}
        <RecommendedProducts products={recommendedProductsByUser} />

        {/* Categorias */}
        <ProductCategories />

        {/* Productos destacados */}
        <FeaturedProducts products={featuredProducts} />

        {/* Productos más buscados */}
        <MostSearchProducts products={popularProducts} />
        
        {/* Nuevos Productos Recientes */}
        <RecentProducts products={products} />
      </div>
    </MainContainer>
  );
}
