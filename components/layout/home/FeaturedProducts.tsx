"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/ProductTypes";

import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";
import ProductsSlider from "../ProductComponents/ProductsSlider";

export const FeaturedProducts = ({ products }: { products: ProductType[] }) => {
  if (!products || products.length <= 0) return null;

  return (
    <section className="py-12 px-2">
      <article className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Productos Destacados
            </h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Las mejores ofertas seleccionadas especialmente para ti
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-full px-6 font-semibold border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 shadow-sm"
        >
          <Link href={"/productos"} className="flex items-center gap-2">
            <span>Ver todos</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </article>

      <ProductsSlider products={products} />
    </section>
  );
};
