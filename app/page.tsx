import { Hero } from "@/components/layout/home/Hero";
import { MainContainer } from "@/components/layout/MainContainer";
import { RecentProducts } from "@/components/layout/home/RecentProducts";
import { ProductCategories } from "@/components/layout/home/ProductCategories";
import { ToolsSection } from "@/components/layout/home/ToolsSection";
import { Categories } from "@/components/layout/Categories/Categories";
import { getProductsAction } from "@/actions/sell-actions";
import { OCRgpt } from "@/components/OCRgpt";
import { OCRVision } from "@/components/OCRVisionTest";

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

        <div>
          <h2 className="text-2xl text-center font-bold mb-4">
            Escaneers OCR para probar
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full place-content-center max-w-4xl mx-auto gap-6">
          <OCRgpt />
          <OCRVision />
        </div>
      </div>
    </MainContainer>
  );
}
