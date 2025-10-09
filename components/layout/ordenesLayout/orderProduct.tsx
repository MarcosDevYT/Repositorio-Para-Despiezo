"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { PrismaOrden } from "@/types/ProductTypes";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const OrderProduct = ({ orden }: { orden: PrismaOrden }) => {
  if (!orden || !orden.items || orden.items.length === 0) return null;

  // 🟢 Si la orden es de tipo KIT
  if (orden.orderType === "KIT") {
    const kitItem = orden.items[0];
    const kit = kitItem.kit;

    if (!kit) return null;

    // Refs para los botones personalizados
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    return (
      <div className="w-full md:w-80 lg:w-sm flex-shrink-0 space-y-6 order-1 md:order-2 relative">
        <Card key={kit.id} className="relative overflow-hidden">
          <Badge
            className="absolute top-2 right-2 bg-blue-600 text-white"
            variant="secondary"
          >
            KIT
          </Badge>
          <CardHeader>
            <CardTitle>{kit.name || "Kit vendido"}</CardTitle>
            <p className="text-sm text-gray-500">
              {kit.discount
                ? `Descuento del ${kit.discount}%`
                : "Precio especial de kit"}
            </p>
            {kit.price && (
              <p className="text-base font-semibold">Total: €{kit.price}</p>
            )}
          </CardHeader>

          <CardContent className="relative">
            {/* Botones de navegación personalizados */}
            <Button
              ref={prevRef}
              variant={"ghost"}
              className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-transparent"
              type="button"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              ref={nextRef}
              variant={"ghost"}
              className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-transparent"
              type="button"
            >
              <ChevronRight className="size-5" />
            </Button>

            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={10}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                if (swiper.params.navigation) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
            >
              {orden.items.length > 0 ? (
                orden.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <SwiperSlide key={item.id}>
                      <Link href={`/productos/${product.id}`} className="group">
                        <div className="flex flex-col items-center gap-4 p-2">
                          <div className="relative w-40 h-40">
                            <Image
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.name}
                              fill
                              className="object-contain rounded-md border"
                            />
                          </div>

                          <div className="text-center space-y-1">
                            <h2 className="text-lg font-semibold group-hover:underline">
                              {product.name}
                            </h2>

                            {product.brand && (
                              <p className="text-sm text-gray-600">
                                {product.brand} {product.model} • {product.year}
                              </p>
                            )}

                            {product.condition && (
                              <Badge variant="outline">
                                {product.condition}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })
              ) : (
                <p className="text-gray-400 italic">
                  Sin productos en este kit
                </p>
              )}
            </Swiper>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🟢 Si la orden NO es de tipo KIT → mostrar solo el primer producto
  const firstItem = orden.items[0];
  const product = firstItem.product;

  if (!product) return null;

  return (
    <div className="w-full md:w-80 lg:w-sm flex-shrink-0 space-y-6 order-1 md:order-2">
      <Card key={product.id} className="relative">
        <Badge
          className="absolute top-2 right-2 bg-gray-700 text-white"
          variant="secondary"
        >
          PRODUCTO
        </Badge>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          {product.price && (
            <p className="text-base font-semibold">Precio: €{product.price}</p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain rounded-md border"
            />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            {product.brand && (
              <p className="text-sm text-gray-600">
                {product.brand} {product.model} • {product.year}
              </p>
            )}
            {product.condition && (
              <Badge variant="outline">{product.condition}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
