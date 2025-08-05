"use client";

import { ProductCard } from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsArray } from "@/data";

export const RecentProducts = () => {
  return (
    <section className="py-8">
      <article className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Productos Vistos Recientemente</h2>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-blue-500 hover:bg-transparent"
        >
          <span>Ver todos</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </article>

      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsArray.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </article>
    </section>
  );
};
