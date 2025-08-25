import { getProductsAction } from "@/actions/sell-actions";
import { Categories } from "@/components/layout/Categories/Categories";
import { MainContainer } from "@/components/layout/MainContainer";
import { ProductCard } from "@/components/layout/ProductComponents/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { Badge } from "@/components/ui/badge";

export default async function AllCategoriesPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ query: string }>;
  params: Promise<{ categorySlug: string }>;
}) {
  const { query } = await searchParams;
  const { categorySlug } = await params;

  const products = await getProductsAction();

  return (
    <MainContainer params={`category/${categorySlug}`}>
      <div className="border-b bg-blue-50 px-4 lg:px-12 py-4 w-full">
        <Categories params={`category/${categorySlug}`} />
      </div>

      {/* Render de Productos */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex gap-8">
          <aside className="hidden md:flex w-1/4">
            <ProductFilters />
          </aside>
          <section className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 w-full">
              <div className="flex flex-wrap gap-4 w-full items-center justify-between">
                <h1 className="text-xl font-bold">
                  {query
                    ? `Resultados para ${categorySlug}: ${query}`
                    : `Todos los productos de ${categorySlug}`}
                </h1>
              </div>

              <Badge className="rounded-full text-sm bg-blue-500/10 text-blue-500">
                {3} productos encontrados
              </Badge>
            </div>

            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={product.isFavorite}
                />
              ))}
            </article>
          </section>
        </div>
      </section>
    </MainContainer>
  );
}
