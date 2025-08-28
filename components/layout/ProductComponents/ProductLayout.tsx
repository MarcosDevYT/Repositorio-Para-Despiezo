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
  Calendar,
  Hash,
  Tag,
  Factory,
  Circle,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { startChatAction } from "@/actions/chat-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductThumbnails } from "./ProductThumbnails";
import { ProductType } from "@/types/ProductTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@prisma/client";

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="size-4 text-muted-foreground" />
      <span className="font-medium">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export const ProductLayout = ({
  product,
  vendedor,
}: {
  product: ProductType;
  vendedor: User;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite ?? false);

  const handleFavorite = async () => {
    const res = await toggleFavoriteAction(product.id);
    if (res.success) {
      setIsFavorite(res.isFavorite);
    }
  };

  const handleInitChat = () => {
    startTransition(async () => {
      const res = await startChatAction(product.id);
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
    <section className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
      {/* Gallery & Info */}
      <article className="relative flex flex-col gap-6 w-full lg:w-3/5">
        <Button
          size="icon"
          variant="outline"
          className="absolute top-2 right-2 rounded-full"
          onClick={handleFavorite}
        >
          <Heart
            className={`size-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>

        <ProductThumbnails product={product} />

        {/* Description & Details */}
        <div className="space-y-6 hidden lg:block">
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Detalles del producto
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Detail icon={Factory} label="Marca" value={product.brand} />
              <Detail icon={Tag} label="Modelo" value={product.model} />
              <Detail icon={Calendar} label="Año" value={product.year} />
              <Detail
                icon={Car}
                label="Vehículo"
                value={product.tipoDeVehiculo}
              />
              <Detail icon={Hash} label="OEM" value={product.oemNumber} />
              <Detail icon={Star} label="Condición" value={product.condition} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </article>

      {/* Purchase & Seller */}
      <article className="flex-1 flex flex-col gap-6">
        {/* Product Info */}
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-border"
              >
                <Car className="size-3" /> {product.tipoDeVehiculo}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-600 border-blue-500/20"
              >
                {product.category}
              </Badge>
              <Badge variant="outline" className={conditionColor}>
                {product.condition}
              </Badge>
              {hasOffer && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                  Oferta
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold">{product.name}</h1>

            {hasOffer ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">
                  Precio: ${product.offerPrice}
                </span>
                <span className="line-through text-muted-foreground">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary">
                Precio: ${product.price}
              </span>
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <Button className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600">
              <ShoppingCart className="size-5" /> Comprar ahora
            </Button>
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={vendedor.image || ""} />
                  <AvatarFallback>{vendedor.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{vendedor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Vendedor desde{" "}
                    {new Date(vendedor.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleInitChat}
                disabled={isPending}
                variant="outline"
                className="w-24 rounded-full border-green-500 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                {isPending ? (
                  <Circle className="size-4 animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="size-5" /> Chat
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="size-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">5.0</span>
              <span className="text-muted-foreground">(16 reseñas)</span>
            </div>

            {product.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <span className="font-medium">{product.location}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description & Details */}
        <div className="space-y-6 lg:hidden">
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Detalles del producto
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Detail icon={Factory} label="Marca" value={product.brand} />
              <Detail icon={Tag} label="Modelo" value={product.model} />
              <Detail icon={Calendar} label="Año" value={product.year} />
              <Detail
                icon={Car}
                label="Vehículo"
                value={product.tipoDeVehiculo}
              />
              <Detail icon={Hash} label="OEM" value={product.oemNumber} />
              <Detail icon={Star} label="Condición" value={product.condition} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};
