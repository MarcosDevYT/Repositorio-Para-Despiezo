"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getConditionColor } from "@/lib/utils";
import { ProductType } from "@/types/ProductTypes";
import { Car, ShoppingCart } from "lucide-react";
import Link from "next/link";

export const ChatProductDetails = ({ product }: { product: ProductType }) => {
  const conditionColor = getConditionColor(product?.condition ?? "nuevo");

  return (
    <aside className="hidden lg:flex w-80 2xl:w-sm border-l border-black/10 min-h-full p-4 flex-col items-center justify-center gap-4 bg-background">
      {/* Imagen principal */}
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nombre + categoría */}
      <div>
        <h2 className="font-semibold text-lg line-clamp-2">{product.name}</h2>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            {product.category}
          </Badge>
          <Badge variant="outline" className={conditionColor}>
            {product.condition}
          </Badge>
          {product.tipoDeVehiculo && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 border border-black/10"
            >
              <Car className="size-3" />
              {product.tipoDeVehiculo}
            </Badge>
          )}
        </div>
      </div>

      {/* Precio */}
      <div>
        {product.offer && product.offerPrice ? (
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-600">
              ${product.offerPrice}
            </span>
            <span className="line-through text-muted-foreground">
              ${product.price}
            </span>
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
              Oferta
            </Badge>
          </div>
        ) : (
          <span className="text-xl font-bold text-primary">
            ${product.price}
          </span>
        )}
      </div>

      <Separator />

      {/* Enlaces */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/productos/${product.id}`}
          className="text-sm text-blue-500 hover:underline"
        >
          Ver publicación completa
        </Link>
        <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full">
          <ShoppingCart className="size-4" />
          Comprar ahora
        </Button>
      </div>
    </aside>
  );
};
