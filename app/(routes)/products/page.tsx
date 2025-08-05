import { ProductCard } from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { Badge } from "@/components/ui/badge";
import { productsArray } from "@/data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  return (
    <div className="flex gap-8">
      <aside className="w-1/4">
        <ProductFilters />
      </aside>
      <section className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold">
            {query ? `Resultados para: ${query}` : "Todos los productos"}
          </h1>

          <Badge className="rounded-full text-sm bg-blue-500/10 text-blue-500">
            {3} productos encontrados
          </Badge>
        </div>

        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsArray.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </article>
      </section>
    </div>
  );
}
