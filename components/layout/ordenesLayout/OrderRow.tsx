"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, DollarSign } from "lucide-react";
import { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";

type PrismaOrden = Prisma.OrdenGetPayload<{
  include: {
    product: true;
  };
}>;

export const OrderRow = ({ order }: { order: PrismaOrden }) => {
  const product = order.product;

  // formatear precio (Stripe suele estar en centavos)
  const total = (order.amountTotal / 100).toFixed(2);

  return (
    <Card className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-4 text-sm">
      {/* Imagen + producto */}
      <div className="flex items-center gap-4 w-full md:w-1/3">
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </span>
          <span className="text-xs text-gray-500 line-clamp-1">
            {product.brand} {product.model} • {product.year}
          </span>
        </div>
      </div>

      {/* Estado del pedido */}
      <div className="flex items-center gap-2 w-full md:w-1/6">
        <Package className="w-4 h-4 text-gray-500" />
        <Badge className="rounded-full text-xs px-3" variant="outline">
          {order.status}
        </Badge>
      </div>

      {/* Estado del envío */}
      <div className="flex items-center gap-2 w-full md:w-1/6">
        <Truck className="w-4 h-4 text-gray-500" />
        <span className="text-xs capitalize">{order.shippingStatus}</span>
      </div>

      {/* Ubicación */}
      <div className="flex items-center gap-2 w-full md:w-1/6">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span className="text-xs line-clamp-1">{product.location}</span>
      </div>

      {/* Total */}
      <div className="flex items-center gap-2 font-semibold text-gray-900 w-full md:w-1/6">
        <DollarSign className="w-4 h-4 text-gray-500" />€{total}
      </div>

      {/* Botón detalles */}
      <div className="w-full md:w-auto flex md:justify-end">
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link href={`/vendedor/ventas/${order.id}`}>Ver detalles</Link>
        </Button>
      </div>
    </Card>
  );
};
