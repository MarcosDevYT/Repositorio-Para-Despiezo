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
  FileText,
  User,
  Phone,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

type PrismaOrden = Prisma.OrdenGetPayload<{
  include: { product: true };
}>;

export const ComprasCard = ({ orden }: { orden: PrismaOrden }) => {
  const product = orden.product;
  const total = (orden.amountTotal / 100).toFixed(2);
  const fee = (orden.feeAmount / 100).toFixed(2);
  const fecha = format(new Date(orden.createdAt), "dd/MM/yyyy");

  return (
    <Card className="w-full rounded-2xl border border-gray-200 shadow-sm bg-white gap-0">
      {/* Header con producto y estado */}
      <CardHeader className="flex items-center gap-4 p-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain rounded-md border bg-gray-50"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">
            {product.brand} {product.model} • {product.year}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs px-2 capitalize">
              {orden.status}
            </Badge>
            <Badge variant="outline" className="text-xs px-2">
              {product.condition}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Contenido con info de envío y pago */}
      <CardContent className="p-4 space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Fecha: {fecha}</span>
        </div>

        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span>Estado de envío: {orden.shippingStatus}</span>
        </div>

        {orden.trackingNumber && (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <span>
              Tracking:{" "}
              <a
                href={orden.trackingUrl || "#"}
                target="_blank"
                className="text-blue-600 underline"
              >
                {orden.trackingNumber}
              </a>
            </span>
          </div>
        )}

        {orden.shippingProvider && (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <span>Proveedor: {orden.shippingProvider}</span>
          </div>
        )}

        {orden.shippingLabelUrl && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <a
              href={orden.shippingLabelUrl}
              target="_blank"
              className="text-blue-600 underline"
            >
              Descargar etiqueta
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>Total pagado: €{total}</span>
        </div>

        {/* Datos de envío */}
        <div className="pt-2 border-t border-gray-200 space-y-1">
          {orden.shippingName && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" /> {orden.shippingName}
            </div>
          )}
          {orden.shippingPhone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" /> {orden.shippingPhone}
            </div>
          )}
          {orden.shippingAddressLine1 ? (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>
                {orden.shippingAddressLine1}
                {orden.shippingAddressLine2 &&
                  ` ${orden.shippingAddressLine2}`}{" "}
                - {orden.shippingCity}, {orden.shippingPostalCode},{" "}
                {orden.shippingCountry}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 italic">
              No se registró dirección de envío
            </span>
          )}
        </div>

        {/* Botón ver detalles */}
        <div className="pt-3">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={`/perfil/compras/${orden.id}`}>Ver detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
