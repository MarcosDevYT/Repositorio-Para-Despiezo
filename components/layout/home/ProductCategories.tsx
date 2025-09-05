"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { categories } from "@/data";

import "swiper/css";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export const ProductCategories = () => {
  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Explora por Categorías</h2>
        <p className="text-muted-foreground">
          Encuentra exactamente lo que necesitas para tu vehículo
        </p>
      </div>

      <div className="lg:hidden">
        <Swiper
          breakpoints={{
            0: { slidesPerView: 1 },
            400: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
          }}
          spaceBetween={0}
          className="mySwiper"
        >
          <SwiperSlide className="py-4 px-2">
            <Card className="group cursor-pointer hover:shadow-hover transition-all duration-300 hover:scale-105 bg-background border border-border p-0">
              <Link className="h-full w-full px-2 py-4" href={"/productos"}>
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-50 text-slate-600 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <ShoppingBag className="size-8" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Todos los productos
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    10,000 productos
                  </p>
                </CardContent>
              </Link>
            </Card>
          </SwiperSlide>

          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <SwiperSlide key={category.id} className="py-4 px-2">
                <Card className="group cursor-pointer hover:shadow-hover transition-all duration-300 hover:scale-105 bg-background border border-border p-0">
                  <Link
                    className="h-full w-full px-2 py-4"
                    href={
                      category.slug === "todas-las-categorias"
                        ? "/productos"
                        : `/productos?categoria=${category.slug}`
                    }
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="size-8" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.count}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 2xl:grid-cols-7 gap-4">
        <Card className="group cursor-pointer hover:shadow-hover transition-all duration-300 hover:scale-105 bg-background border border-border p-0">
          <Link className="h-full w-full px-2 py-4" href={"/productos"}>
            <CardContent className="p-6 text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-50 text-slate-600 group-hover:scale-110 transition-transform duration-300`}
              >
                <ShoppingBag className="size-8" />
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                Todos los productos
              </h3>
              <p className="text-xs text-muted-foreground">10,000 productos</p>
            </CardContent>
          </Link>
        </Card>

        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-hover transition-all duration-300 hover:scale-105 bg-background border border-border p-0"
            >
              <Link
                className="h-full w-full px-2 py-4"
                href={
                  category.slug === "todas-las-categorias"
                    ? "/productos"
                    : `/productos?categoria=${category.slug}`
                }
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="size-8" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count}
                  </p>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
