"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/ProductTypes";

import Link from "next/link";
import ProductsSlider from "../ProductComponents/ProductsSlider";

export const HistoryProducts = ({ products }: { products: ProductType[] }) => {
  if (!products || products.length <= 0) return null;

  return (
    <section className="py-12 px-2">
      <article className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Vistos Recientemente
            </h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Continúa donde lo dejaste
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
