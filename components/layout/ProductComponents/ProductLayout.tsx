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
  Loader2,
  Truck,
  Zap,
} from "lucide-react";
import { useState, useTransition, useEffect, useRef } from "react";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { startChatAction } from "@/actions/chat-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductThumbnails } from "./ProductThumbnails";
import { ProductType } from "@/types/ProductTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { differenceInDays, differenceInHours } from "date-fns";
import { User } from "@prisma/client";
import { ProductCompatibilities } from "./ProductCompatibilities";

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
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        <Icon className="size-4 text-primary flex-shrink-0" />
        <span className="text-sm font-semibold text-foreground line-clamp-1">{value}</span>
      </div>
    </div>
  );
}

export const ProductLayout = ({
  product,
  vendedor,
  session,
}: {
  product: ProductType;
  vendedor: User;
  session?: Session | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFavoritePending, startFavoriteTransition] = useTransition();

  const [isFavorite, setIsFavorite] = useState(product.isFavorite ?? false);
  const [isSticky, setIsSticky] = useState(false);
  const stickyCardRef = useRef<HTMLDivElement>(null);

  const isSold = product.status === "vendido";

  // Detectar cuando el card está en modo sticky
  useEffect(() => {
    const handleScroll = () => {
      if (stickyCardRef.current) {
        const rect = stickyCardRef.current.getBoundingClientRect();
        // Consideramos sticky cuando el top del card está cerca del top de la ventana (96px = top-24)
        setIsSticky(rect.top <= 96);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFavorite = () => {
    startFavoriteTransition(async () => {
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

  // Funcion para llamar al action asi crear un chat con el vendedor
  const handleInitChat = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/productos/${product.id}`);
      return;
    }

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
    <>
      <section className="container mx-auto px-4 lg:px-6 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Gallery & Info */}
        <article className="relative flex flex-col gap-4 w-full lg:w-[58%]">
          {product.featuredUntil &&
            new Date(product.featuredUntil) > new Date() && (
              <div className="absolute top-2.5 left-2.5 z-10 px-3 py-1.5 rounded-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {session?.user.id === vendedor.id && (
                  <span className="text-white text-xs font-semibold">
                    {(() => {
                      const now = new Date();
                      const end = new Date(product.featuredUntil);
                      const days = differenceInDays(end, now);
                      const totalHours = differenceInHours(end, now);
                      const hours = totalHours - days * 24;
                      if (totalHours <= 0) return "Finalizado";
                      return `${days}d ${hours}h`;
                    })()}
                  </span>
                )}
              </div>
            )}

          <Button
            size="icon"
            variant="ghost"
            className="z-10 absolute top-2.5 right-2.5 rounded-full h-9 w-9 backdrop-blur-xl bg-white/95 hover:bg-white shadow-md border border-white/50 transition-all hover:scale-110"
            disabled={isFavoritePending}
            onClick={handleFavorite}
          >
            <Heart
              className={`size-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>

          <ProductThumbnails product={product} />

          {/* Description */}
          <div className="space-y-5">
            <Card className="border border-border/50">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-bold">Descripción del producto</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </article>

        {/* Purchase & Seller */}
        <article className="flex-1 flex flex-col gap-4">
          {/* Product Info */}
          <Card 
            ref={stickyCardRef}
            className={`border border-border/50 lg:sticky lg:top-24 z-10 transition-all duration-300 ${isSticky ? 'shadow-lg' : ''}`}
          >
            <CardHeader className={`transition-all duration-300 ${isSticky ? 'py-2 space-y-1' : 'pb-4 space-y-3'}`}>
              <h1 className={`font-bold text-foreground leading-tight transition-all duration-300 ${isSticky ? 'text-sm lg:text-base line-clamp-1' : 'text-xl lg:text-2xl'}`}>
                {product.name}
              </h1>

              {/* Precio y botón en línea cuando sticky */}
              <div className={`transition-all duration-300 ${isSticky ? 'flex items-center gap-3' : ''}`}>
                {hasOffer ? (
                  <div className="flex items-baseline gap-2">
                    <span className={`font-black text-primary transition-all duration-300 ${isSticky ? 'text-lg' : 'text-3xl lg:text-4xl'}`}>
                      €{product.offerPrice}
                    </span>
                    <span className={`line-through text-muted-foreground transition-all duration-300 ${isSticky ? 'text-xs' : 'text-lg'}`}>
                      €{product.price}
                    </span>
                  </div>
                ) : (
                  <span className={`font-black text-foreground transition-all duration-300 ${isSticky ? 'text-lg' : 'text-3xl lg:text-4xl'}`}>
                    €{product.price}
                  </span>
                )}

                {/* Botón comprar - inline en sticky */}
                {!isSold && isSticky && (
                  <Button
                    asChild
                    size="sm"
                    className="hidden lg:flex text-sm rounded-lg font-bold shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90 h-8 px-4"
                  >
                    <Link href={`/productos/${product.id}/checkout`}>
                      <ShoppingCart className="size-4" />
                      Comprar
                    </Link>
                  </Button>
                )}
              </div>

              {/* Badges - Ocultos en modo sticky en desktop */}
              <div className={`flex flex-wrap items-center gap-1.5 transition-all duration-300 ${isSticky ? 'hidden' : ''}`}>
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-2.5 py-0.5"
                >
                  {product.category}
                </Badge>
                <Badge variant="outline" className={`${conditionColor} text-xs font-semibold px-2.5 py-0.5`}>
                  {product.condition}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-2.5 py-0.5"
                >
                  {product.tipoDeVehiculo}
                </Badge>
                {hasOffer && (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs font-semibold px-2.5 py-0.5">
                    OFERTA
                  </Badge>
                )}
              </div>
            </CardHeader>

            {/* CardContent - Oculto en sticky desktop, visible en móvil */}
            <CardContent className={`flex flex-col gap-2.5 transition-all duration-300 ${isSticky ? 'lg:hidden' : ''}`}>
              {isSold ? (
                <Button
                  variant={"destructive"}
                  className="rounded-xl h-12 w-full cursor-not-allowed font-bold text-base"
                  disabled
                >
                  VENDIDO
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    className="text-base w-full rounded-xl font-bold shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90 h-12"
                  >
                    <Link href={`/productos/${product.id}/checkout`}>
                      <ShoppingCart className="size-5" />
                      Comprar ahora
                    </Link>
                  </Button>

                  {session?.user.id !== vendedor.id && (
                    <Button
                      onClick={handleInitChat}
                      disabled={isPending}
                      variant="outline"
                      className="h-12 rounded-xl border-2 font-bold text-base hover:bg-muted/50 transition-all"
                    >
                      {isPending ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <>
                          <MessageCircle className="size-5" />
                          Contactar vendedor
                        </>
                      )}
                    </Button>
                  )}

                  {session?.user.id === vendedor.id && (
                    <div className="flex flex-col gap-2 mt-1">
                      {product.featuredUntil &&
                      new Date(product.featuredUntil) > new Date() ? (
                        <div className="flex flex-row gap-2 w-full">
                          {/* Botón informativo: días u horas restantes */}
                          <Button className="w-1/2 rounded-full cursor-default">
                            <Star className="size-6" />
                            {(() => {
                              const now = new Date();
                              const end = new Date(product.featuredUntil);

                              const days = differenceInDays(end, now);
                              const totalHours = differenceInHours(end, now);
                              const hours = totalHours - days * 24;

                              // Si ya expiró
                              if (totalHours <= 0)
                                return "El destacado ha finalizado";

                              return `Faltan ${days} ${
                                days === 1 ? "día" : "días"
                              } y ${hours} ${hours === 1 ? "hora" : "horas"}`;
                            })()}
                          </Button>

                          {/* Botón para extender destacado */}

                          <Button
                            asChild
                            className="w-1/2 rounded-full bg-green-500 text-white hover:bg-green-600"
                          >
                            <Link href={`/vendedor/destacar/${product.id}`}>
                              <Star className="size-6" />
                              Extender Destacado
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        // Botón normal para destacar si no está destacado
                        <Button
                          asChild
                          className="w-full text-base rounded-full bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <Link href={`/vendedor/destacar/${product.id}`}>
                            <Star className="size-6" />
                            Destacar
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Características - Posicionado donde antes estaban las compatibilidades */}
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-bold">Características</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Detail icon={Factory} label="Marca" value={product.brand} />
                <Detail icon={Tag} label="Modelo" value={product.model} />
                <Detail icon={Calendar} label="Año" value={product.year} />
                <Detail
                  icon={Car}
                  label="Vehículo"
                  value={product.tipoDeVehiculo}
                />
                <Detail icon={Hash} label="OEM" value={product.oemNumber} />
                <Detail
                  icon={Star}
                  label="Condición"
                  value={product.condition}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Link href={`/tienda/${vendedor.id}`} className="flex-shrink-0">
                  <Avatar className="size-14">
                    <AvatarImage
                      className="object-cover"
                      src={vendedor.image || ""}
                    />
                    <AvatarFallback className="text-lg font-bold">
                      {vendedor.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/tienda/${vendedor.id}`}>
                      <p className="font-bold text-base text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {vendedor.name}
                      </p>
                    </Link>
                    {/* Badge Vendedor Pro - A la derecha del nombre */}
                    <Badge className="bg-primary text-white shrink-0 px-2 py-0.5 text-xs flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Vendedor Pro
                    </Badge>
                  </div>
                  <Link href={`/tienda/${vendedor.id}`}>
                    <p className="text-sm text-muted-foreground line-clamp-1 hover:text-foreground transition-colors">
                      {vendedor.businessName || "Vendedor profesional"}
                    </p>
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{vendedor.averageRating}</span>
                    <span className="text-xs text-muted-foreground">(16 valoraciones)</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5 pt-3">
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  En Despiezo desde{" "}
                  <span className="font-semibold text-foreground">
                    {new Date(vendedor.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </span>
              </div>

              {product.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Ubicación: <span className="font-semibold text-foreground">{product.location}</span>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                <Truck className="size-4 text-primary" />
                <span className="font-semibold text-sm">Envío disponible a toda España</span>
              </div>
            </CardContent>
          </Card>
        </article>
      </section>

      {/* Compatibilidades - Ocupando todo el ancho abajo */}
      {product.oemCompatibilidades && product.oemCompatibilidades.length > 0 && (
        <section className="container mx-auto px-4 lg:px-6 pb-12">
          <ProductCompatibilities compatibilidades={product.oemCompatibilidades} />
        </section>
      )}
    </>
  );
};
