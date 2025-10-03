"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../ProductComponents/ProductCard";
import { ProductType } from "@/types/ProductTypes";

import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";

export const RecommendedProducts = ({
  products,
}: {
  products: ProductType[];
}) => {
  if (!products || products.length <= 0) return null;

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-8">
      <article className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recomendaciones para ti</h2>

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

      <div className="relative md:px-12">
        {/* Botones de navegación personalizados */}
        <Button
          ref={prevRef}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary/90 hover:bg-primary rounded-full shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          ref={nextRef}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary/90 hover:bg-primary rounded-full shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <Swiper
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
          }}
          spaceBetween={0}
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // Necesario para que Swiper reconozca los refs
            if (swiper.params.navigation) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="p-2">
              <div className="w-full h-full flex flex-col items-center ">
                <ProductCard
                  product={product}
                  isFavorite={product.isFavorite}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
