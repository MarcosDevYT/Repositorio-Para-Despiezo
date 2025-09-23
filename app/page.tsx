import { Hero } from "@/components/layout/home/Hero";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { ToolsSection } from "@/components/layout/home/ToolsSection";
import { Categories } from "@/components/layout/Categories/Categories";
import { getProductsAction } from "@/actions/sell-actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProductsAction();

  return (
    <MainContainer>
      <div className="border-b bg-blue-50 px-4 lg:px-12 py-4 w-full">
        <Categories />
      </div>

      <Hero />

      <div className="container mx-auto px-4 pt-4">
        <RecentProducts products={products} />
        <ProductCategories />
        <ToolsSection />
      </div>
    </MainContainer>
  );
}
