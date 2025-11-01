import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Box, Calendar, Check, MapPin, Zap } from "lucide-react";
import Image from "next/image";

import { VendorFullDataResponse } from "./TiendaLayout";

export const TiendaHeader = ({
  vendedorData,
}: {
  vendedorData: VendorFullDataResponse;
}) => {
  const vendedorInfo = vendedorData.user!;
  const total = vendedorData.total;

  return (
    <section className="border border-border rounded-2xl shadow-sm bg-white">
      <figure className="w-full shrink-0 h-60 relative overflow-clip rounded-t-2xl border-b">
        <Image
          src={"/hero-banner.jpg"}
          alt={`Banner de la Tienda ${vendedorInfo.businessName}`}
          fill
        />
      </figure>

      <article className="flex flex-col md:flex-row">
        {/* Columna izquierda: avatar y nombre */}
        <div className="relative flex flex-col items-center justify-center border-b md:border-b-0 md:border-r p-6 min-w-72 gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
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
            <h2 className="text-xl font-semibold text-gray-900">
              {vendedorInfo.businessName ?? "Sin nombre de negocio"}
            </h2>
            <span className="text-sm text-gray-500">{vendedorInfo.name}</span>
          </div>

          {/* Badges (solo mobile) */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 mt-2">
            {vendedorInfo.emailVerified && (
              <span className="bg-green-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Check className="size-5" /> Verificado
              </span>
            )}
            {vendedorInfo.bussinesCategory?.map((cat, i) => (
              <span
                key={i}
                className="bg-blue-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Columna derecha: información detallada */}
        <div className="h-full w-full relative p-6 flex flex-col justify-center gap-4">
          {/* Badges (desktop) */}
          <div className="hidden md:flex flex-wrap gap-2 mb-2">
            {vendedorInfo.emailVerified && (
              <span className="bg-green-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Check className="size-5" /> Verificado
              </span>
            )}
            {vendedorInfo.bussinesCategory?.map((cat, i) => (
              <span
                key={i}
                className="bg-blue-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Descripción */}
          {vendedorInfo.description && vendedorInfo.businessName && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Sobre {vendedorInfo.businessName}
              </h3>
              <p className="text-sm text-gray-600">
                {vendedorInfo.description}
              </p>
            </div>
          )}

          {/* Datos de contacto / info */}
          <div className="space-y-2 text-gray-700 text-sm">
            <p className="flex items-center gap-2">
              <Box className="size-5 text-gray-500" />
              <span className="font-medium">Productos:</span> {total}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-5 text-gray-500" />
              <span className="font-medium">Ubicación:</span>{" "}
              {vendedorInfo.location || "—"}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="size-5 text-gray-500" />
              <span className="font-medium">Miembro desde:</span>{" "}
              {vendedorInfo.createdAt
                ? new Date(vendedorInfo.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};
