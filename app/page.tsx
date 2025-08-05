import { HeroCarousel } from "@/components/layout/home/HeroCarousel";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { NavCategories } from "@/components/layout/navbar/NavCategories";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { ToolsSection } from "@/components/layout/home/ToolsSection";

export default async function Home() {
  return (
    <MainContainer className="py-16 mt-4">
      <aside className="h-16 bg-blue-100">
        <div className="container mx-auto flex items-center justify-center h-full w-full px-4">
          {/* Categorias */}
          <NavCategories />
        </div>
      </aside>
      <div className="container mx-auto px-4 pt-16">
        <HeroCarousel />
        <RecentProducts />
        <ProductCategories />
        <ToolsSection />
      </div>
    </MainContainer>
  );
}
