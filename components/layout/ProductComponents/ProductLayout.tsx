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
  ChevronRight,
} from "lucide-react";
import { useState, useTransition, useEffect, useRef } from "react";
import { toggleFavoriteAction } from "@/actions/user-actions";
import { startChatAction } from "@/actions/chat-actions";
import { searchByMatricula, type MatriculaResponseSolvedia, type VehicleVersion, type AvailableVersion } from "@/actions/matricula-actions";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { differenceInDays, differenceInHours } from "date-fns";
import { ProductCompatibilities } from "./ProductCompatibilities";
import { AutoCompatibilityLoader } from "./AutoCompatibilityLoader";

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
  product: any;
  vendedor: any;
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
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState<VehicleVersion[]>([]);
  const [availableVersions, setAvailableVersions] = useState<AvailableVersion[]>([]);

  const isSold = product.status === "vendido";

  const checkCompatibility = (marca: string, modelo: string, anio: string): boolean => {
    if (!product.oemCompatibilidades) return false;

    // --- Helpers de normalización ---

    // Sinónimos conocidos para modelos de coches en distintos idiomas/fuentes
    const MODEL_SYNONYMS: Record<string, string> = {
      "class": "class", "classe": "class", "klasse": "class",
      "series": "series", "serie": "series",
      "sportback": "sportback", "sport": "sport",
    };

    /** Normaliza un string: minúsculas, quita acentos, reemplaza separadores por espacio */
    const normalize = (s: string): string =>
      s.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar acentos
        .replace(/[-_/.]/g, " ")  // separadores → espacio
        .replace(/\s+/g, " ")     // colapsar espacios
        .trim();

    /** Extrae tokens significativos (ignora paréntesis y contenido dentro) */
    const tokenize = (s: string): string[] =>
      normalize(s)
        .replace(/\([^)]*\)/g, "") // quitar (W177), (F20), etc.
        .split(" ")
        .filter(t => t.length > 0)
        .map(t => MODEL_SYNONYMS[t] || t);

    /** Compara marca: ambas normalizadas deben coincidir o una contener a la otra */
    const matchMarca = (a: string, b: string): boolean => {
      const na = normalize(a);
      const nb = normalize(b);
      if (na === nb) return true;
      // Una contiene a la otra (ej: "mercedes benz" includes "mercedes benz")
      if (na.includes(nb) || nb.includes(na)) return true;
      // Comparar primera palabra (ej: "mercedes" === "mercedes")
      const firstA = na.split(" ")[0];
      const firstB = nb.split(" ")[0];
      return firstA === firstB;
    };

    /** Compara modelo con lógica de tokens: 
     *  Verifica que los tokens significativos del modelo más corto 
     *  estén presentes en el más largo */
    const matchModelo = (a: string, b: string): boolean => {
      const na = normalize(a);
      const nb = normalize(b);
      if (na === nb) return true;
      if (na.includes(nb) || nb.includes(na)) return true;

      const tokensA = tokenize(a);
      const tokensB = tokenize(b);

      if (tokensA.length === 0 || tokensB.length === 0) return false;

      // Contar cuántos tokens del conjunto más pequeño aparecen en el más grande
      const [shorter, longer] = tokensA.length <= tokensB.length 
        ? [tokensA, tokensB] : [tokensB, tokensA];

      const matchCount = shorter.filter(t => longer.includes(t)).length;

      // Si al menos la mitad de los tokens del más corto coinciden → match
      // Y al menos 1 token coincide
      return matchCount >= 1 && matchCount >= Math.ceil(shorter.length / 2);
    };

    /** Extrae todos los años de un string (ej: "11.2018 - actual 2026" → [2018, 2026]) */
    const extractYears = (s: string): number[] => {
      const matches = s.match(/\b(19|20)\d{2}\b/g);
      return matches ? matches.map(Number) : [];
    };

    /** Compara año: el año de la compatibilidad debe caer dentro del rango del vehículo */
    const matchAnio = (vehicleAnio: string, compAnio: string): boolean => {
      if (!vehicleAnio || !compAnio) return true; // sin datos → no filtrar

      const vehicleYears = extractYears(vehicleAnio);
      const compYears = extractYears(compAnio);

      if (vehicleYears.length === 0 || compYears.length === 0) return true;

      // Rango del vehículo (desde la matrícula)
      const vMin = Math.min(...vehicleYears);
      const vMax = vehicleAnio.toLowerCase().includes("actual") 
        ? new Date().getFullYear() 
        : Math.max(...vehicleYears);

      // Rango de la compatibilidad
      const cMin = Math.min(...compYears);
      const cMax = compAnio.toLowerCase().includes("actual")
        ? new Date().getFullYear()
        : Math.max(...compYears);

      // Los rangos se solapan si uno no termina antes de que empiece el otro
      return vMin <= cMax && cMin <= vMax;
    };

    // --- Ejecución del matching ---
    return product.oemCompatibilidades.some((comp: any) => {
      const compMarca = comp.marca || "";
      const compModelo = comp.modelo || "";
      const compAnio = comp.anio || "";

      const marcaOk = matchMarca(marca, compMarca);
      const modeloOk = matchModelo(modelo, compModelo);
      const anioOk = matchAnio(anio, compAnio);

      return marcaOk && modeloOk && anioOk;
    });
  };

  const handleSelectVersion = (version: VehicleVersion | null, index: number, availVersion?: AvailableVersion) => {
    setShowVersionModal(false);
    
    // Actualizar la matrícula con el índice seleccionado
    const basePlate = matricula.includes("-") ? matricula.split("-")[0] : matricula;
    const indexedPlate = index === 0 ? basePlate : `${basePlate}-${index}`;
    setMatricula(indexedPlate.toUpperCase());

    let marca = "";
    let modelo = "";
    let anio = "";

    if (version) {
      marca = version.versionName.split(" ")[0];
      modelo = version.versionName.split(" ").slice(1, 3).join(" ");
      if (version.details && version.details["Año de fabricación (desde - hasta)"]) {
        anio = version.details["Año de fabricación (desde - hasta)"];
      }
    } else if (availVersion) {
      const nameParts = availVersion.name.split(" ");
      marca = nameParts[0];
      modelo = nameParts.slice(1, 3).join(" ");
      const yearMatch = availVersion.name.match(/\((\d{2}\.\d{4})/);
      if (yearMatch) anio = yearMatch[1];
    }

    setVehicleInfo({ marca, modelo, anio });
    
    const isCompatible = checkCompatibility(marca, modelo, anio);
    setCompatibilityStatus(isCompatible ? "compatible" : "incompatible");
    
    if (isCompatible) {
      toast.success("¡Esta pieza es compatible con tu vehículo!");
    } else {
      toast.warning("Esta pieza no es compatible con tu vehículo");
    }
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

        // Si tiene múltiples versiones, mostramos el modal
        const solResult = result as MatriculaResponseSolvedia;
        const hasMultiple = solResult.hasMultipleVersions || 
          ("data" in result && "processedVersions" in result.data && result.data.processedVersions.length > 1);
        
        if (hasMultiple) {
          setVersions(solResult.data.processedVersions || []);
          setAvailableVersions(solResult.data.availableVersions || []);
          setCompatibilityStatus("idle");
          setShowVersionModal(true);
          return;
        }

        const isOscaro = "version" in result.data && "label" in result.data;
        let fullName = "";
        let details: any = null;

        if (isOscaro) {
          fullName = (result.data as any).fullName;
        } else {
          fullName = (result as MatriculaResponseSolvedia).data.processedVersions[0].versionName;
          details = (result as MatriculaResponseSolvedia).data.processedVersions[0].details;
        }

        const marca = fullName.split(" ")[0];
        let modelo = "";
        let anio = "";
        
        if (isOscaro) {
          const parts = fullName.split(" ");
          modelo = parts.slice(1, 3).join(" ");
          const oscaroData = result.data as any;
          const yearMatch = oscaroData.version?.match(/\b(19|20)\d{2}\b/);
          anio = yearMatch ? yearMatch[0] : "";
        } else {
          modelo = fullName.split(" ").slice(1, 3).join(" ");
          if (details && details["Año de fabricación (desde - hasta)"]) {
            anio = details["Año de fabricación (desde - hasta)"];
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
      <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Car className="size-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Selecciona tu versión</DialogTitle>
                <DialogDescription className="mt-0.5">
                  Matrícula: <strong>{matricula}</strong>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-start gap-2 px-1 py-2 bg-amber-50 rounded-lg border border-amber-100 mt-2">
            <span className="text-amber-500 mt-0.5">⚠</span>
            <p className="text-sm text-amber-700">
              Encontramos {availableVersions.length > 0 ? availableVersions.length : versions.length} versiones para este vehículo. Selecciona la que corresponda a tu coche para verificar compatibilidad.
            </p>
          </div>

          <ScrollArea className="max-h-[60vh] mt-2 pr-4">
            <div className="grid gap-3">
              {versions.length > 1 ? versions.map((version, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectVersion(version, version.currentVersionIndex)}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <Car className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {version.versionName}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                        {version.details?.Tipo && <span><strong>Motor:</strong> {version.details.Tipo}</span>}
                        {version.details?.["Año de fabricación (desde - hasta)"] && <span><strong>Año:</strong> {version.details["Año de fabricación (desde - hasta)"]}</span>}
                        {version.details?.["Potencia [cv]"] && <span><strong>Potencia:</strong> {version.details["Potencia [cv]"]} CV</span>}
                        {version.details?.["Tipo de combustible"] && <span><strong>Combustible:</strong> {version.details["Tipo de combustible"]}</span>}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </button>
              )) : availableVersions.map((av) => {
                const processedVersion = versions.find(v => v.currentVersionIndex === av.index);
                return (
                  <button
                    key={av.index}
                    onClick={() => handleSelectVersion(processedVersion || null, av.index, av)}
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Car className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {processedVersion ? processedVersion.versionName : av.name}
                        </h3>
                        {processedVersion ? (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            {processedVersion.details?.Tipo && <span><strong>Motor:</strong> {processedVersion.details.Tipo}</span>}
                            {processedVersion.details?.["Año de fabricación (desde - hasta)"] && <span><strong>Año:</strong> {processedVersion.details["Año de fabricación (desde - hasta)"]}</span>}
                            {processedVersion.details?.["Potencia [cv]"] && <span><strong>Potencia:</strong> {processedVersion.details["Potencia [cv]"]} CV</span>}
                            {processedVersion.details?.["Tipo de combustible"] && <span><strong>Combustible:</strong> {processedVersion.details["Tipo de combustible"]}</span>}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 mt-1">{av.name}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowVersionModal(false)}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-xs text-primary font-medium animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Validando variaciones y compatibilidad, por favor espera...
                      </div>
                      <Progress value={undefined} className="h-1 bg-primary/10" />
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
      <section className="container mx-auto px-4 lg:px-6 pb-12">
        {product.oemCompatibilidades && product.oemCompatibilidades.length > 0 ? (
          <ProductCompatibilities compatibilidades={product.oemCompatibilidades} />
        ) : (
          <AutoCompatibilityLoader
            productId={product.id}
            oemNumber={product.oemNumber}
            hasCompatibilities={product.oemCompatibilidades && product.oemCompatibilidades.length > 0}
          />
        )}
      </section>
    </>
  );
};
