import { getProductsAction } from "@/actions/sell-actions";
import { ProductCard } from "@/components/layout/ProductComponents/ProductCard";
import { Badge } from "@/components/ui/badge";

import ProductFilters from "@/components/ProductFilters";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;

  const products = await getProductsAction();

  return (
    <div className="flex gap-8">
      <aside className="hidden md:flex w-1/4">
        <ProductFilters />
      </aside>
      <section className="flex flex-col gap-4 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 w-full">
          <h1 className="text-xl font-bold">
            {query ? `Resultados para: ${query}` : "Todos los productos"}
          </h1>

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
  );
}
