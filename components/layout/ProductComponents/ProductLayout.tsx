"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getConditionColor } from "@/lib/utils";
import {
  Star,
  MapPin,
  MessageCircle,
  Heart,
  ShoppingCart,
  Car,
  Circle,
} from "lucide-react";

import { useState, useTransition } from "react";
import { Product } from "@prisma/client";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { startChatAction } from "@/actions/chat-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductThumnails } from "./ProductThumnails";

export const ProductLayout = ({
  product,
}: {
  product: Product & { isFavorite?: boolean };
}) => {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(product.isFavorite ?? false);
  const [isPending, startTransition] = useTransition();

  const handleFavorite = async () => {
    const res = await toggleFavoriteAction(product.id);
    if (res.success) {
      setIsFavorite(res.isFavorite);
    }
  };

  const handleInitChat = () => {
    const productId = product.id;

    startTransition(async () => {
      const res = await startChatAction(productId);

      if (!res?.success) {
        toast.error(res?.error);
        return;
      }

      router.push(res.url!);
    });
  };

  const conditionColor = getConditionColor(product?.condition ?? "nuevo");

  const hasOffer = product.offer && product.offerPrice;

  return (
    <section className="flex flex-col lg:flex-row gap-12">
      {/* Gallery */}
      <ProductThumnails product={product} />

      {/* Product Info */}
      <div className="flex-1 space-y-6 relative">
        {/* Favorite button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-0 right-0 rounded-full"
          onClick={handleFavorite}
        >
          <Heart
            className={`size-5 ${
              isFavorite ? "fill-current text-red-500" : ""
            }`}
          />
        </Button>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="size-5 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">5.0</span>
          <span className="text-muted-foreground">(16 reseñas)</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            {product.category}
          </Badge>
          <Badge variant="outline" className={conditionColor}>
            {product.condition}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 border border-black"
          >
            <Car className="size-3" />
            {product.tipoDeVehiculo}
          </Badge>
        </div>

        {/* Price / Offer */}
        <div>
          {hasOffer ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-600">
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
            <span className="text-3xl font-bold text-primary">
              ${product.price}
            </span>
          )}
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Detalles del producto</h3>
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Marca" value={product.brand} />
            <Detail label="Modelo" value={product.model} />
            <Detail label="Año" value={product.year} />
            <Detail label="Tipo de pieza" value={product.typeOfPiece} />
            <Detail label="Estado" value={product.condition} />
          </div>

          <Detail label="Número OEM" value={product.oemNumber} large />

          <div className="flex items-center gap-2">
            <MapPin className="min-w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{product.location}</span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Descripción</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <Button
            className="flex-1 rounded-full bg-green-500 text-white hover:bg-green-600"
            disabled={isPending}
            onClick={handleInitChat}
          >
            {isPending ? (
              <Circle className="size-4 animate-spin" />
            ) : (
              <>
                <MessageCircle className="size-5" />
                Chatear con el vendedor
              </>
            )}
          </Button>
          <Button className="flex-1 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <ShoppingCart className="size-5" />
            Comprar ahora
          </Button>
        </div>
      </div>
    </section>
  );
};

function Detail({
  label,
  value,
  large,
}: {
  label: string;
  value: string | null;
  large?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <p className={`font-medium ${large ? "text-lg" : ""}`}>{value}</p>
    </div>
  );
}
