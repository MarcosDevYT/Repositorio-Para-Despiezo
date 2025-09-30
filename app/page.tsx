import { Hero } from "@/components/layout/home/Hero";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { ToolsSection } from "@/components/layout/home/ToolsSection";
import { Categories } from "@/components/layout/Categories/Categories";
import { getProductsAction } from "@/actions/sell-actions";
import { auth } from "@/auth";
import { FeaturedProducts } from "@/components/layout/home/FeaturedProducts";
import { MostSearchProducts } from "@/components/layout/home/MostSearchProducts copy";
import { HistoryProducts } from "@/components/layout/home/HistoryProducts";
import { RecommendedProducts } from "@/components/layout/home/RecommendedProducts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  const products = await getProductsAction();

  return (
    <MainContainer>
      <div className="border-b bg-blue-50 px-4 lg:px-12 py-4 w-full">
        <Categories userId={session?.user.id} />
      </div>

      <Hero />

      <div className="container mx-auto px-4 pt-4">
        {/* Ultimos productos vistos */}
        <HistoryProducts products={products} />

        {/* Productos recomendados vistos */}
        <RecommendedProducts products={products} />

        {/* Categorias */}
        <ProductCategories />

        {/* Productos recomendados vistos */}
        <FeaturedProducts products={products} />

        {/* Productos recomendados vistos */}
        <MostSearchProducts products={products} />

        {/* Herramienta para buscar */}
        <ToolsSection />
        {/* Nuevos Productos Recientes */}
        <RecentProducts products={products} />
      </div>
    </MainContainer>
  );
}
