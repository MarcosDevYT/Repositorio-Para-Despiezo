"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getConditionColor } from "@/lib/utils";
import { Product } from "@prisma/client";
import { toggleFavoriteAction } from "@/actions/user-actions";

export const ProductCard = ({
  product,
  isFavorite: initialFavorite,
}: {
  product: Product;
  isFavorite: boolean;
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);

  const handleFavorite = async () => {
    const res = await toggleFavoriteAction(product.id);
    if (res.success) {
      setIsFavorite(res.isFavorite);
    }
  };

  const conditionColor = getConditionColor(product.condition);

  return (
    <Card className="border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow gap-0 py-0">
      {/* Imagen + acciones */}
      <div className="relative aspect-square max-h-[300px] md:max-h-[340px]">
        {product.offer && (
          <Badge className="absolute top-2 left-2 z-10 bg-destructive text-white">
            Oferta
          </Badge>
        )}

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={handleFavorite}
          className="absolute top-2 right-2 z-10 rounded-full p-1.5"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </Button>

        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain w-full h-full"
          />
        </Link>
      </div>

      {/* Contenido */}
      <CardContent className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500" />
              <span className="text-sm font-medium">5</span>
            </div>
            <span className="text-sm text-muted-foreground">(16 reseñas)</span>
          </div>

          <Badge variant="outline" className={conditionColor}>
            {product.condition}
          </Badge>
        </div>

        {/* Nombre */}
        <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>

        {/* Ubicación + estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="min-w-4 h-4" />
            <span>{product.location}</span>
          </div>
        </div>

        {/* Descripción breve */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Precio + botón */}
        <div className="flex items-center justify-between">
          {product.offer && product.offerPrice ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground line-through">
                ${product.price}
              </span>
              <span className="text-lg font-bold text-green-600">
                ${product.offerPrice}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
          )}

          <Link
            href={`/products/${product.id}`}
            className="px-3 py-1.5 text-sm rounded-full bg-primary text-white hover:bg-primary/90 transition"
          >
            Ver detalles
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
