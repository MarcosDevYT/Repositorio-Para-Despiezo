"use client";

import { useState, useTransition } from "react";
import { Heart, Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getConditionColor } from "@/lib/utils";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { ProductType } from "@/types/ProductTypes";
import { incrementClicksProduct } from "@/actions/sell-actions";

export const ProductCard = ({
  product,
  isFavorite: initialFavorite,
}: {
  product: ProductType;
  isFavorite: boolean | undefined;
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
  const [isPending, startTransition] = useTransition();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    startTransition(async () => {
      try {
        const res = await toggleFavoriteAction(product.id);
        if (res.success) {
          setIsFavorite(res.isFavorite);
        }
      } catch (error) {
        console.error("Error al marcar como favorito:", error);
      }
    });
  };

  const handleClickProduct = () => {
    try {
      incrementClicksProduct(product.id); // No bloqueante
    } catch (error) {
      console.error("Error incrementando clicks:", error);
    }
  };

  const conditionColor = getConditionColor(product.condition);

  return (
    <Link 
      href={`/productos/${product.id}`}
      className="group w-full max-w-80 flex flex-col"
      onClick={handleClickProduct}
      prefetch={true}
    >
      <Card className="rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300 group-hover:-translate-y-1 flex flex-col h-full">
        {/* Imagen + acciones */}
        <CardHeader className="relative p-0 flex-shrink-0">
          {/* Badges superiores: Destacado y Oferta */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-start gap-1.5">
            {product.featuredUntil && new Date(product.featuredUntil) > new Date() && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[10px] font-bold">Destacado</span>
              </div>
            )}

            {product.offer && (
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg">
                ¡OFERTA!
              </span>
            )}
          </div>

          {/* Botón de favorito */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            disabled={isPending}
            className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full backdrop-blur-xl bg-white/90 hover:bg-white shadow-md border border-white/50 transition-all hover:scale-110"
          >
            <Heart
              className={`size-4 transition-all 
              ${isPending ? "animate-pulse" : ""}
              ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 group-hover:text-red-400"}`}
            />
          </Button>

          {/* Badge de condición sobre la imagen - abajo izquierda */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <Badge
              variant="outline"
              className={`${conditionColor} rounded-full text-[10px] px-2.5 py-0.5 capitalize font-bold border-2 backdrop-blur-md bg-white/95 shadow-lg`}
            >
              {product.condition}
            </Badge>
          </div>

          {/* Imagen del producto */}
          <div className="relative h-44 bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain w-full h-full p-3 group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay sutil en hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>

        {/* Contenido */}
        <CardContent className="p-3 flex flex-col flex-1">
          {/* Nombre - compacto */}
          <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug h-[2.4rem] mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Info técnica en línea compacta */}
          <div className="flex items-center gap-1.5 mb-2 text-[11px] font-medium text-muted-foreground">
            <span className="text-foreground font-semibold">{product.brand}</span>
            <span>•</span>
            <span>{product.model}</span>
            <span>•</span>
            <span>{product.year}</span>
          </div>

          {/* Numero OEM - una línea compacta */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
            <Car className="size-3 min-w-3 text-primary" />
            <span className="line-clamp-1 font-mono">
              {product.oemNumber}
            </span>
          </div>

          {/* Spacer para empujar precio al fondo */}
          <div className="flex-1"></div>

          {/* Precio y CTA - siempre al fondo */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
            <div className="flex flex-col">
              {product.offer && product.offerPrice ? (
                <>
                  <span className="text-[10px] line-through text-muted-foreground leading-none">
                    €{product.price}
                  </span>
                  <span className="text-xl font-black text-green-600 leading-tight">
                    €{product.offerPrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-foreground leading-tight">
                  €{product.price}
                </span>
              )}
            </div>

            <Button
              className="h-8 px-4 text-xs rounded-full font-semibold shadow-sm hover:shadow-md transition-all"
              variant={"default"}
              asChild
            >
              <div onClick={(e) => e.stopPropagation()}>Ver más</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

