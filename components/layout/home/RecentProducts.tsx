"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/ProductTypes";

import Link from "next/link";
import ProductsSlider from "../ProductComponents/ProductsSlider";

export const RecentProducts = ({ products }: { products: ProductType[] }) => {
  if (!products || products.length <= 0) return null;

  return (
    <section className="py-12 px-2">
      <article className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Recién Llegados
            </h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Las últimas piezas añadidas a nuestro catálogo
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
