"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ProductType } from "@/types/ProductTypes";

import "swiper/css";
import "swiper/css/navigation";

export default function ProductsSlider({
  navigation = true,
  products,
}: {
  navigation?: boolean;
  products: ProductType[];
}) {
  if (navigation) {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    return (
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
            <SwiperSlide key={product.id} className="flex">
              <div className="w-full h-full flex flex-col items-center p-2">
                <ProductCard
                  product={product}
                  isFavorite={product.isFavorite}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="relative">
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
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="p-2 flex">
            <div className="w-full h-full flex flex-col items-center ">
              <ProductCard product={product} isFavorite={product.isFavorite} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
