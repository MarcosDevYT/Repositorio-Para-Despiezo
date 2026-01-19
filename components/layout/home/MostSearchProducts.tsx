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
    <section className="py-12 px-2">
      <article className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Lo más buscado
            </h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Productos populares entre nuestros usuarios
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-full px-6 font-semibold border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 shadow-sm"
        >
          <Link href="/productos" className="flex items-center gap-2">
            <span>Ver todos</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </article>

      <ProductsSlider products={products} />
    </section>
  );
};
