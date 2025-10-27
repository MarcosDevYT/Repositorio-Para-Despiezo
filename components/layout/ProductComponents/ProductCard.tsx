"use client";

import { useState, useTransition } from "react";
import { Heart, Star, MapPin, Car } from "lucide-react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getConditionColor } from "@/lib/utils";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { ProductType } from "@/types/ProductTypes";
import { incrementClicksProduct } from "@/actions/sell-actions";
import { useRouter } from "next/navigation";

export const ProductCard = ({
  product,
  isFavorite: initialFavorite,
}: {
  product: ProductType;
  isFavorite: boolean | undefined;
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFavorite = () => {
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

  const handleClickProduct = async () => {
    try {
      await incrementClicksProduct(product.id);
    } catch (error) {
      console.error("Error incrementando clicks:", error);
    }

    // Navega al detalle del producto
    router.push(`/productos/${product.id}`);
  };

  const conditionColor = getConditionColor(product.condition);

  return (
    <Card className="w-full max-w-72 h-[410px] rounded-2xl py-0 gap-0 border shadow-sm overflow-hidden bg-white">
      {/* Imagen + acciones */}
      <CardHeader className="relative">
        {product.offer && (
          <span className="absolute top-3 right-3 z-10 px-3 py-1 text-xs font-medium rounded-full bg-red-500/90 text-white shadow-md">
            Oferta
          </span>
        )}

        {product.featuredUntil &&
          new Date(product.featuredUntil) > new Date() && (
            <div className="absolute top-3 left-3 z-10 p-0.5 rounded-full shadow-md bg-white">
              <Image
                src={"/destacado-icon-green.png"}
                alt="Icono de Patrocinado"
                width={36}
                height={36}
              />
            </div>
          )}

        <div
          className="relative h-40 rounded-lg cursor-pointer"
          onClick={handleClickProduct}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain w-full h-full"
          />
        </div>
      </CardHeader>

      {/* Contenido */}
      <CardContent className="p-4 space-y-3 h-full flex flex-col justify-between">
        {/* Nombre y rating */}
        <div className="flex flex-row items-center justify-between gap-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            disabled={isPending}
            className="rounded-full backdrop-blur-md shadow-sm bg-white hover:bg-white"
          >
            <Heart
              className={`size-5 transition-colors 
              ${isPending ? "animate-pulse" : ""}
              ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>

        {/* Badges técnicos */}
        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className={`${conditionColor} rounded-full text-xs px-3 capitalize`}
          >
            {product.condition}
          </Badge>
          <Badge variant="outline" className="rounded-full text-xs px-3">
            {product.brand}
          </Badge>
          <Badge variant="outline" className="rounded-full text-xs px-3">
            {product.model}
          </Badge>
          <Badge variant="outline" className="rounded-full text-xs px-3">
            {product.year}
          </Badge>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          {/* Numero OEM */}
          <div className="flex items-center">
            <Car className="size-4 min-w-4 mr-1" />
            <span className="line-clamp-1">
              Numero OEM: {product.oemNumber}
            </span>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between pt-2">
          {product.offer && product.offerPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm line-through text-gray-400">
                €{product.price}
              </span>
              <span className="text-xl font-bold text-green-600">
                €{product.offerPrice}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              €{product.price}
            </span>
          )}

          <Button
            className="px-4 py-2 text-sm rounded-full"
            onClick={handleClickProduct}
            variant={"card"}
          >
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
