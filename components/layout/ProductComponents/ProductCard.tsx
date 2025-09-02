"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, MapPin, Car } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getConditionColor } from "@/lib/utils";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { ProductType } from "@/types/ProductTypes";

export const ProductCard = ({
  product,
  isFavorite: initialFavorite,
}: {
  product: ProductType;
  isFavorite: boolean | undefined;
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
  const [isPending, startTransition] = useTransition();

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

  const conditionColor = getConditionColor(product.condition);

  return (
    <Card className="w-full rounded-2xl pb-0 gap-0 border border-transparent shadow-sm overflow-hidden bg-white">
      {/* Imagen + acciones */}
      <CardHeader className="relative">
        {product.offer && (
          <span className="absolute top-0 left-3 z-10 px-3 py-1 text-xs font-medium rounded-full bg-red-500/90 text-white shadow-md">
            Oferta
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavorite}
          disabled={isPending}
          className="absolute -top-2 right-3 z-10 rounded-full backdrop-blur-md shadow-sm bg-white hover:bg-white"
        >
          <Heart
            className={`size-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </Button>

        <div className="relative h-60 md:h-64 rounded-lg">
          <Link href={`/productos/${product.id}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain w-full h-full "
            />
          </Link>
        </div>
      </CardHeader>

      {/* Contenido */}
      <CardContent className="p-5 space-y-4">
        {/* Nombre y rating */}
        <div className="flex flex-col gap-1 justify-between items-start">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-yellow-500 text-sm">
              <Star className="size-4 fill-yellow-500" />
              <span className="ml-1 font-medium">5.0</span>
            </div>

            <Badge
              variant="outline"
              className={`${conditionColor} rounded-full text-xs px-3`}
            >
              {product.condition}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Badges técnicos */}
        <div className="flex flex-wrap gap-2">
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

          {/* Ubicación */}
          <div className="flex items-center">
            <MapPin className="size-4 min-w-4 mr-1" />
            <span className="line-clamp-1">{product.location}</span>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between pt-2">
          {product.offer && product.offerPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm line-through text-gray-400">
                ${product.price}
              </span>
              <span className="text-xl font-bold text-green-600">
                ${product.offerPrice}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
          )}

          <Button
            className="px-4 py-2 text-sm rounded-full"
            variant={"card"}
            asChild
          >
            <Link href={`/productos/${product.id}`}>Ver detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
