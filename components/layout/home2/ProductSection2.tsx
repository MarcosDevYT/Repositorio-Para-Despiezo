"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/ProductTypes";
import Link from "next/link";
import ProductsSlider from "../ProductComponents/ProductsSlider";
import { ReactNode } from "react";

interface ProductSection2Props {
  title: string;
  subtitle: string;
  products: ProductType[];
  icon: ReactNode;
  gradient: string;
  href?: string;
}

export const ProductSection2 = ({
  title,
  subtitle,
  products,
  icon,
  gradient,
  href = "/productos",
}: ProductSection2Props) => {
  if (!products || products.length <= 0) return null;

  return (
    <section className="py-16 px-2 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-0 right-0 w-96 h-96 ${gradient} rounded-full blur-3xl opacity-20`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 ${gradient} rounded-full blur-3xl opacity-10`}></div>
      </div>

      <article className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-4">
            {/* Icono grande con animación */}
            <div className={`relative h-20 w-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300`}>
              {icon}
              {/* Ping de animación */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} animate-ping opacity-30`}></div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                {title}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mt-1 font-medium">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className={`rounded-2xl px-8 py-6 font-bold text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-r ${gradient}`}
        >
          <Link href={href} className="flex items-center gap-2 group">
            <span>Ver todos</span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </article>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <ProductsSlider products={products} />
      </div>
    </section>
  );
};
