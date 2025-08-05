"use client";

import { Heart, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { getConditionColor } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  condition: "Nuevo" | "Verificado" | "Usado" | "Defectuoso";
  isOffer?: boolean;
  isFavorite?: boolean;
}

export const ProductCard = ({
  id,
  image,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  location,
  description,
  condition,
  isOffer = false,
}: ProductCardProps) => {
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  const conditionColor = getConditionColor(condition);

  return (
    <Card className="border border-border bg-card py-2">
      <div className="relative overflow-hidden rounded-t-lg">
        {isOffer && (
          <Badge className="absolute top-0 left-2 z-10 bg-destructive">
            Oferta
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsFavoriteState(!isFavoriteState);
          }}
          className={`absolute top-0 right-2 z-10 transition-colors text-muted-foreground hover:text-destructive`}
        >
          <Heart
            className={`h-5 w-5 ${isFavoriteState ? "fill-red-500" : "fill-none"}`}
          />
        </Button>

        <div className="aspect-square overflow-hidden cursor-pointer">
          <Link href={`/products/${id}`}>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} reseñas)
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-base line-clamp-2">{title}</h3>

        {/* Location and Condition */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <Badge variant="outline" className={conditionColor}>
            {condition}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">${price}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <Button variant="card" className="rounded-full" size="sm">
            <Link href={`/products/${id}`}>Ver detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
