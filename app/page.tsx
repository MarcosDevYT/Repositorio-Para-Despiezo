import { Hero } from "@/components/layout/home/Hero";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { ToolsSection } from "@/components/layout/home/ToolsSection";
import { Categories } from "@/components/layout/Categories/Categories";
import {
  getFeaturedProducts,
  getLastViewedProducts,
  getPopularProductsFromSearchLogs,
  getProductsAction,
  getRecommendedProductsForUser,
} from "@/actions/sell-actions";
import { auth } from "@/auth";
import { FeaturedProducts } from "@/components/layout/home/FeaturedProducts";
import { MostSearchProducts } from "@/components/layout/home/MostSearchProducts copy";
import { HistoryProducts } from "@/components/layout/home/HistoryProducts";
import { RecommendedProducts } from "@/components/layout/home/RecommendedProducts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  // Ultimos productos vistos por el usuario
  const lastProductView = await getLastViewedProducts(session?.user.id);

  // Productos recomendados para el usuario
  const recommendedProductsByUser = await getRecommendedProductsForUser(
    session?.user.id
  );

  // Productos destacados
  const featuredProducts = await getFeaturedProducts();

  // Productos mas buscados
  const popularProducts = await getPopularProductsFromSearchLogs();

  // Productos recientes
  const products = await getProductsAction();

  return (
    <MainContainer>
      <div className="border-b bg-blue-50 px-4 lg:px-12 py-4 w-full">
        <Categories userId={session?.user.id} />
      </div>

      <Hero />

      <div className="container mx-auto px-4 pt-4">
        {/* Ultimos productos vistos */}
        <HistoryProducts products={lastProductView} />

        {/* Productos recomendados vistos */}
        <RecommendedProducts products={recommendedProductsByUser} />

        {/* Categorias */}
        <ProductCategories />

        {/* Productos recomendados vistos */}
        <FeaturedProducts products={featuredProducts} />

        {/* Productos recomendados vistos */}
        <MostSearchProducts products={popularProducts} />

        {/* Herramienta para buscar */}
        <ToolsSection />
        {/* Nuevos Productos Recientes */}
        <RecentProducts products={products} />
      </div>
    </MainContainer>
  );
}
