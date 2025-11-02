import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, VendorAnalytics } from "@prisma/client";
import { Check, Clock, MapPin, Star, Zap } from "lucide-react";
import Image from "next/image";
import { VendorCounts } from "./TiendaLayout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const TiendaHeader = ({
  vendedorInfo,
  counts,
  analytics,
}: {
  vendedorInfo: User | null;
  counts: VendorCounts | null;
  analytics: VendorAnalytics | null;
}) => {
  if (!vendedorInfo) return null;

  return (
    <section className="border border-border rounded-2xl shadow-sm bg-white">
      {vendedorInfo.businessBannerUrl && vendedorInfo.pro && (
        <figure className="w-full shrink-0 h-72 relative overflow-clip rounded-t-2xl border-b">
          <Image
            src={vendedorInfo.businessBannerUrl}
            alt={`Banner de ${vendedorInfo.businessName}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </figure>
      )}

      <article className="flex flex-col md:flex-row">
        {/* Columna izquierda: avatar y nombre */}
        <div className="relative flex flex-col items-center justify-center border-b md:border-b-0 md:border-r p-6 min-w-72 gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="size-36 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
              <AvatarImage
                className="object-cover"
                src={vendedorInfo.image || ""}
              />
              <AvatarFallback>{vendedorInfo.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <Tooltip>
              <TooltipTrigger className="absolute top-0 right-0 z-10">
                <div className="rounded-full size-8 flex items-center justify-center bg-primary text-background ">
                  <Zap size={20} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Miembro Pro</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Nombre del negocio */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {vendedorInfo.businessName ?? "Sin nombre de negocio"}
            </h2>
            <span className="text-base text-gray-500">{vendedorInfo.name}</span>
          </div>

          {/* Badges (solo mobile) */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 mt-2">
            {vendedorInfo.emailVerified && (
              <Badge className="rounded-full bg-green-500/90 text-white gap-1 hover:bg-green-600">
                <Check size={18} />
                Verificado
              </Badge>
            )}
            {analytics?.avgResponseMin && (
              <Badge className="rounded-full bg-blue-500/90 text-white gap-1 hover:bg-blue-600">
                <Clock size={18} />
                Responde rápido
              </Badge>
            )}
            {vendedorInfo.bussinesCategory?.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="rounded-full bg-primary/10"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Columna derecha: información detallada */}
        <div className="h-full w-full relative p-6 flex flex-col justify-center gap-4">
          {/* Verification & Categories - Desktop */}
          <div className="hidden md:flex flex-wrap gap-2 mb-4">
            {vendedorInfo.emailVerified && (
              <Badge className="text-sm rounded-full bg-green-500/90 text-white gap-1 hover:bg-green-600">
                <Check size={24} />
                Verificado
              </Badge>
            )}
            {analytics?.avgResponseMin && (
              <Badge className="text-sm rounded-full bg-blue-500/90 text-white gap-1 hover:bg-blue-600">
                <Clock size={24} />
                Responde rápido
              </Badge>
            )}
            {vendedorInfo.bussinesCategory?.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-sm rounded-full bg-primary/10"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Description */}
          {vendedorInfo.description && (
            <div className="mb-6">
              <h3 className="text-base font-bold text-foreground/80 uppercase tracking-wide mb-2">
                Sobre la tienda
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {vendedorInfo.description}
              </p>
            </div>
          )}

          {/* Performance Badges - Smaller cards */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 pb-6 border-b border-border">
            {/* Calificacion */}
            <Card className="flex flex-col items-center justify-start gap-3 border-2">
              <span className="text-base font-bold uppercase tracking-wide text-center">
                Calificacion
              </span>
              <p className="text-3xl font-bold inline-flex gap-2 items-center ml-7">
                {4.5} <Star className="text-[#ffdf20]" fill="#ffdf20" />
              </p>
            </Card>

            {/* Productos */}
            <Card className="flex flex-col items-center justify-start gap-3 border-2">
              <span className="text-base font-bold uppercase tracking-wide text-center">
                Productos
              </span>
              <p className="text-3xl font-bold inline-flex gap-2 items-center ">
                {analytics?.totalProducts || 0}
              </p>
              <span className="text-sm text-muted-foreground text-center">
                {counts?.vendidos || 0} vendidos
              </span>
            </Card>

            {/* Vendidos */}
            <Card className="flex flex-col items-center justify-start gap-3 border-2">
              <span className="text-base font-bold uppercase tracking-wide text-center">
                Vendidos
              </span>
              <p className="text-3xl text-green-600 font-bold inline-flex gap-2 items-center ">
                {counts?.vendidos || 0}
              </p>
              <span className="text-sm text-muted-foreground text-center">
                Productos
              </span>
            </Card>

            {/* Tiempo Respuesta */}
            {analytics?.avgResponseMin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="flex flex-col items-center justify-start gap-3 border-2">
                      <span className="text-base  font-bold uppercase tracking-wide text-center">
                        <Clock size={12} />
                        Respuesta
                      </span>
                      <p className="text-3xl font-bold text-blue-600">
                        {analytics?.avgResponseMin}
                      </p>
                      <span className="text-sm text-blue-600 text-center">
                        Promedio
                      </span>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tiempo promedio de respuesta a consultas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Fast Shipper */}
            {analytics?.isFastShipper && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="flex flex-col items-center justify-start gap-3 border-2">
                      <span className="text-base  font-bold uppercase tracking-wide text-center">
                        <Zap size={12} />
                        Envío
                      </span>
                      <p className="text-3xl text-emerald-600 font-bold inline-flex gap-2 items-center ">
                        Rápido
                      </p>
                      <span className="text-xs text-emerald-600 text-center">
                        Ágil
                      </span>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Este vendedor destaca por envíos rápidos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Footer Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} className="text-primary/60" />
              <span>{vendedorInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wide">
                Miembro desde
              </span>
              <span>
                {new Date(vendedorInfo.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
