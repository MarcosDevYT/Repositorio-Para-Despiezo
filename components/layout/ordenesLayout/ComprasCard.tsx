"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Package,
  Truck,
  DollarSign,
  User,
  Phone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

// Ahora incluimos items con producto y kit
type PrismaOrden = Prisma.OrdenGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        kit: true;
      };
    };
  };
}>;

export const ComprasCard = ({ orden }: { orden: PrismaOrden }) => {
  const total = (orden.amountTotal / 100).toFixed(2);
  const fecha = format(new Date(orden.createdAt), "dd/MM/yyyy");
  const firstItem = orden.items[0];
  const itemData = firstItem?.product || firstItem?.kit;

  return (
    <Card className="w-full p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Imagen + Producto Info */}
        <div className="flex items-center gap-4 min-w-[250px]">
          {itemData && (
            <>
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src={itemData.images[0]}
                  alt={itemData.name}
                  fill
                  className="object-contain rounded-md border bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {itemData.name}
                </h3>
                {firstItem?.product && (
                  <span className="text-xs text-gray-500">
                    {firstItem.product.brand} {firstItem.product.model} •{" "}
                    {firstItem.product.year}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Info Grid - Estados y Datos */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm place-items-center">
          {/* Columna 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{fecha}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <Badge variant="outline" className="text-xs px-2 capitalize">
                {orden.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-700 capitalize">
                {orden.shippingStatus}
              </span>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-2">
            {orden.trackingNumber && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <a
                  href={orden.trackingUrl || "#"}
                  target="_blank"
                  className="text-xs text-blue-600 underline line-clamp-1"
                >
                  {orden.trackingNumber}
                </a>
              </div>
            )}
            {orden.shippingProvider && (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-700">
                  {orden.shippingProvider}
                </span>
              </div>
            )}
            {orden.shippingName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-700 line-clamp-1">
                  {orden.shippingName}
                </span>
              </div>
            )}
            {orden.shippingPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-700">
                  {orden.shippingPhone}
                </span>
              </div>
            )}
          </div>

          {/* Columna 3 */}
          <div className="space-y-2">
            {orden.shippingAddressLine1 ? (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-700 line-clamp-3">
                  {orden.shippingAddressLine1}
                  {orden.shippingAddressLine2 &&
                    ` ${orden.shippingAddressLine2}`}
                  , {orden.shippingCity}, {orden.shippingPostalCode},{" "}
                  {orden.shippingCountry}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">
                No se registró dirección
              </span>
            )}
          </div>
        </div>

        {/* Total y Botón */}
        <div className="flex flex-col items-end gap-3 min-w-[140px]">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span>€{total}</span>
          </div>
          <Button variant="outline" size="sm" asChild className="rounded-full">
            <Link href={`/perfil/compras/${orden.id}`}>Ver detalles</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
