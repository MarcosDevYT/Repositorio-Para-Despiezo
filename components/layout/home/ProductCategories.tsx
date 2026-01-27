"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { ShoppingBag } from "lucide-react";
import { categories } from "@/lib/constants/data";

import "swiper/css";

import Link from "next/link";

export const ProductCategories = () => {
  return (
    <section className="py-12 px-2">
      <div className="text-center mb-10 space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Explora por Categorías
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Encuentra exactamente lo que necesitas para tu vehículo en nuestra selección organizada
        </p>
      </div>

      <div className="lg:hidden">
        <Swiper
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
          }}
          spaceBetween={0}
          className="mySwiper"
        >
          <SwiperSlide className="py-4 px-2">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/50 overflow-hidden relative">
              <Link className="h-full w-full px-2 py-4 block" href={"/productos"}>
                <CardContent className="p-6 text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <ShoppingBag className="size-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-primary transition-colors">
                    Todos los productos
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    +10,000 productos
                  </p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Card>
          </SwiperSlide>

          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <SwiperSlide key={category.id} className="py-4 px-2">
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/50 overflow-hidden relative">
                  <Link
                    className="h-full w-full px-2 py-4 block"
                    href={
                      category.slug === "todas-las-categorias"
                        ? "/productos"
                        : `/productos?categoria=${category.slug}`
                    }
                  >
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <Icon className="size-8 text-white" />
                      </div>
                      <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {category.count}
                      </p>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/50 overflow-hidden relative">
          <Link className="h-full w-full px-2 py-4 block" href={"/productos"}>
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <ShoppingBag className="size-8 text-white" />
              </div>
              <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-primary transition-colors">
                Todos los productos
              </h3>
              <p className="text-xs text-muted-foreground font-medium">+10,000 productos</p>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </Card>

        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/50 overflow-hidden relative"
            >
              <Link
                className="h-full w-full px-2 py-4 block"
                href={
                  category.slug === "todas-las-categorias"
                    ? "/productos"
                    : `/productos?categoria=${category.slug}`
                }
              >
                <CardContent className="p-6 text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="size-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {category.count}
                  </p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
