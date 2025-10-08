"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/ProductTypes";

import Link from "next/link";
import ProductsSlider from "../ProductComponents/ProductsSlider";

export const MostSearchProducts = ({
  products,
}: {
  products: ProductType[];
}) => {
  if (!products || products.length <= 0) return null;

  return (
    <section className="py-8">
      <article className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Lo más buscado</h2>

        <Button
          asChild
          variant="ghost"
          className="rounded-full flex items-center space-x-2 text-primary hover:text-blue-600"
        >
          <Link href={"/productos"}>
            <span>Ver todos</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </article>

      <ProductsSlider products={products} />
    </section>
  );
};
