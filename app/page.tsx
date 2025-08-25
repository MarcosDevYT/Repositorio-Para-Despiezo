import { HeroCarousel } from "@/components/layout/home/HeroCarousel";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { ToolsSection } from "@/components/layout/home/ToolsSection";
import { Categories } from "@/components/layout/Categories/Categories";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <MainContainer params="products">
      <div className="border-b bg-blue-50 px-4 lg:px-12 py-4 w-full">
        <Categories params="products" />
      </div>

      <div className="container mx-auto px-4 pt-16">
        <HeroCarousel />
        <RecentProducts />
        <ProductCategories />
        <ToolsSection />
      </div>
    </MainContainer>
  );
}
