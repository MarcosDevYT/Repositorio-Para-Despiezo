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
  Search,
  CheckCircle,
  XCircle,
  PartyPopper,
  Frown,
  ShieldCheck,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { useState, useTransition, useEffect, useRef } from "react";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { startChatAction } from "@/actions/chat-actions";
import { searchByMatricula } from "@/actions/matricula-actions";
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
import { Input } from "@/components/ui/input";
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

  // Verificador de Matrícula State
  const [matricula, setMatricula] = useState("");
  const [isVerifying, startVerifyTransition] = useTransition();
  const [compatibilityStatus, setCompatibilityStatus] = useState<"idle" | "loading" | "compatible" | "incompatible">("idle");
  const [vehicleInfo, setVehicleInfo] = useState<{ marca: string; modelo: string; anio: string } | null>(null);

  const isSold = product.status === "vendido";

  const checkCompatibility = (marca: string, modelo: string, anio: string): boolean => {
    if (!product.oemCompatibilidades) return false;
    
    const normalizedMarca = marca.toLowerCase().trim();
    const normalizedModelo = modelo.toLowerCase().trim();
    
    return product.oemCompatibilidades.some((comp) => {
      const compMarca = (comp.marca || "").toLowerCase().trim();
      const compModelo = (comp.modelo || "").toLowerCase().trim();
      const compAnio = comp.anio || "";
      
      const marcaMatch = compMarca.includes(normalizedMarca) || normalizedMarca.includes(compMarca);
      const modeloMatch = compModelo.includes(normalizedModelo) || normalizedModelo.includes(compModelo);
      
      let anioMatch = true;
      if (anio && compAnio) {
        if (compAnio.includes("-")) {
          const [start, end] = compAnio.split("-").map((y: string) => parseInt(y.trim()));
          const vehicleYear = parseInt(anio);
          anioMatch = vehicleYear >= start && vehicleYear <= end;
        } else {
          anioMatch = compAnio.includes(anio) || anio.includes(compAnio);
        }
      }
      
      return marcaMatch && modeloMatch && anioMatch;
    });
  };

  const handleVerifyMatricula = () => {
    if (!matricula.trim()) {
      toast.error("Ingresa una matrícula");
      return;
    }

    setCompatibilityStatus("loading");

    startVerifyTransition(async () => {
      try {
        const result = await searchByMatricula(matricula);

        if (!result.success) {
          setCompatibilityStatus("idle");
          toast.error("error" in result ? result.error : "Matrícula no encontrada");
          return;
        }

        const marca = result.data.fullName.split(" ")[0];
        const isOscaro = "version" in result.data && "label" in result.data;
        
        let modelo = "";
        let anio = "";
        
        if (isOscaro) {
          const parts = result.data.fullName.split(" ");
          modelo = parts.slice(1, 3).join(" ");
          const oscaroData = result.data as any;
          const yearMatch = oscaroData.version?.match(/\b(19|20)\d{2}\b/);
          anio = yearMatch ? yearMatch[0] : "";
        } else {
          modelo = result.data.fullName.split(" ").slice(1, 3).join(" ");
          const details = result.data as any;
          if (details.details && details.details["Año de fabricación (desde - hasta)"]) {
            const yearRange = details.details["Año de fabricación (desde - hasta)"];
            const yearMatch = yearRange.match(/\b(19|20)\d{2}\b/);
            anio = yearMatch ? yearMatch[0] : "";
          }
        }

        setVehicleInfo({ marca, modelo, anio });
        
        const isCompatible = checkCompatibility(marca, modelo, anio);
        setCompatibilityStatus(isCompatible ? "compatible" : "incompatible");
        
        if (isCompatible) {
          toast.success("¡Esta pieza es compatible con tu vehículo!");
        } else {
          toast.warning("Esta pieza no es compatible con tu vehículo");
        }
      } catch (error) {
        console.error(error);
        setCompatibilityStatus("idle");
        toast.error("Error al verificar la matrícula");
      }
    });
  };

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
          <Card className="border border-border/50 overflow-hidden">
            <CardHeader className="pb-4 bg-muted/30">
              <div className="flex items-start gap-4">
                <Link href={`/tienda/${vendedor.id}`} className="flex-shrink-0">
                  <Avatar className="size-20 border-2 border-white shadow-md">
                    <AvatarImage
                      className="object-cover"
                      src={vendedor.image || ""}
                    />
                    <AvatarFallback className="text-2xl font-bold">
                      {vendedor.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex flex-col gap-1">
                    <Link href={`/tienda/${vendedor.id}`}>
                      <p className="font-bold text-xl text-foreground line-clamp-1 hover:text-primary transition-colors leading-tight">
                        {vendedor.name}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-white shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Vendedor Pro
                      </Badge>
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                        <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-yellow-700">{vendedor.averageRating}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/tienda/${vendedor.id}`} className="mt-2 block">
                    <p className="text-sm text-muted-foreground line-clamp-1 hover:text-foreground transition-colors font-medium">
                      {vendedor.businessName || "Vendedor profesional verificado"}
                    </p>
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-5 pb-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Miembro desde</span>
                    <span className="font-semibold text-foreground">
                      {new Date(vendedor.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </div>

                {product.location && (
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <MapPin className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Ubicación</span>
                      <span className="font-semibold text-foreground line-clamp-1">{product.location}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm bg-primary/5 border border-primary/10 rounded-xl p-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="size-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-primary">Envío garantizado</span>
                    <span className="text-xs text-primary/70 font-medium">Disponible a toda España</span>
                  </div>
                </div>
              </div>

              {session?.user.id !== vendedor.id && (
                <Button 
                  onClick={handleInitChat}
                  variant="outline" 
                  className="w-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 h-11 rounded-xl font-bold flex items-center gap-2 group transition-all"
                >
                  <MessageCircle className="size-5 text-primary group-hover:scale-110 transition-transform" />
                  Ver perfil y valoraciones
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Verificador de Compatibilidad - Diseño más destacado */}
          <Card className="border-2 border-primary/20 overflow-hidden bg-gradient-to-b from-white to-primary/5 dark:from-gray-950 dark:to-primary/10 shadow-lg shadow-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5">
                {/* Cabecera del verificador */}
                <div className="space-y-1.5 text-center">
                  <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-primary/10 text-primary mb-1">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    ¿Es compatible con tu coche?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Evita devoluciones innecesarias verificando la matrícula de tu vehículo ahora mismo.
                  </p>
                </div>

                {/* Campo de Matrícula Estilo Realista */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-stretch gap-0 h-16 rounded-xl overflow-hidden border-2 border-muted-foreground/30 bg-white dark:bg-gray-900 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm">
                      {/* Franja Europea (estética) */}
                      <div className="w-10 bg-blue-700 flex flex-col items-center justify-center py-1 flex-shrink-0">
                        <div className="text-[8px] text-white font-bold mb-0.5">E</div>
                        <div className="w-5 h-5 rounded-full border border-yellow-400/50 flex items-center justify-center relative">
                          <Star className="size-2.5 text-yellow-400 fill-yellow-400 absolute top-0" />
                          <Star className="size-2.5 text-yellow-400 fill-yellow-400 absolute bottom-0" />
                          <Star className="size-2.5 text-yellow-400 fill-yellow-400 absolute left-0" />
                          <Star className="size-2.5 text-yellow-400 fill-yellow-400 absolute right-0" />
                        </div>
                      </div>
                      <Input
                        value={matricula}
                        onChange={(e) => {
                          setMatricula(e.target.value.toUpperCase());
                          if (compatibilityStatus !== "idle" && compatibilityStatus !== "loading") {
                            setCompatibilityStatus("idle");
                            setVehicleInfo(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleVerifyMatricula();
                          }
                        }}
                        placeholder="1234ABC"
                        className="h-full flex-1 border-0 rounded-none text-3xl font-black tracking-[0.25em] uppercase text-center placeholder:text-muted-foreground/20 focus-visible:ring-0 bg-transparent"
                        maxLength={10}
                        disabled={isVerifying}
                      />
                      <Button
                        onClick={handleVerifyMatricula}
                        disabled={!matricula.trim() || isVerifying}
                        className="h-full px-8 rounded-none bg-primary hover:bg-primary/90 text-white font-bold transition-all flex items-center gap-2 group/btn"
                      >
                        {isVerifying ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <>
                            <Search className="h-6 w-6 group-hover/btn:scale-110 transition-transform" />
                            <span className="text-lg">Verificar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Indicador de carga sutil fuera del botón */}
                  {isVerifying && (
                    <div className="flex items-center justify-center gap-2 text-xs text-primary font-medium animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Consultando bases de datos de tráfico...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <div className="p-0">
              {/* Card de Resultado de Compatibilidad */}
              {vehicleInfo && compatibilityStatus === "compatible" && (
                <div className="relative overflow-hidden border-t-2 border-green-500 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/20 p-6">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <Sparkles className="absolute top-3 right-3 h-5 w-5 text-green-400/50" />
                  
                  <div className="relative flex flex-col items-center text-center gap-4">
                    {/* Icon Section */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <Car className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-md">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <PartyPopper className="h-5 w-5 text-green-600" />
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-400">
                          ¡Totalmente Compatible!
                        </h3>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 max-w-[250px] mx-auto leading-snug">
                        Hemos verificado tu <span className="font-bold">{vehicleInfo.marca} {vehicleInfo.modelo}</span> {vehicleInfo.anio && <span>({vehicleInfo.anio})</span>} y esta pieza es la correcta.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <Badge className="bg-green-600 hover:bg-green-600 text-white border-0 shadow-sm text-xs py-0.5 px-3">
                        ✓ Compra Segura
                      </Badge>
                      <Badge variant="outline" className="border-green-600/30 text-green-700 dark:text-green-400 text-[10px] bg-white/50">
                        Verificado por Despiezo
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {vehicleInfo && compatibilityStatus === "incompatible" && (
                <div className="relative overflow-hidden border-t border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/10 p-6">
                  <div className="relative flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Frown className="h-7 w-7 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-amber-800 dark:text-amber-400">
                        Lo sentimos, no es compatible
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-tight px-1 max-w-[240px] mx-auto">
                        Tu <span className="font-semibold">{vehicleInfo.marca} {vehicleInfo.modelo}</span> requiere una referencia diferente.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full pt-1">
                      <Button variant="outline" size="sm" className="h-8 text-[10px] border-amber-300 text-amber-800 bg-white/40 hover:bg-white/60">
                        <Search className="h-3 w-3 mr-1.5" />
                        Buscar pieza para mi vehículo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
