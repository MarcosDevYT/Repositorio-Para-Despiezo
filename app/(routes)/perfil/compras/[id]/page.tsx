import { getOrdenByID } from "@/actions/order-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  DollarSign,
  MapPin,
  Phone,
  User,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OrderTracking } from "@/components/layout/ordenesLayout/OrderTracking";

export default async function CompradorDetalleOrden({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orden = await getOrdenByID(id);

  if (!orden) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-500">
          Orden no encontrada
        </h2>
        <Button asChild className="mt-4">
          <Link href="/comprador/ordenes">Volver a mis órdenes</Link>
        </Button>
      </div>
    );
  }

  const total = (orden.amountTotal / 100).toFixed(2);

  return (
    <div className="p-6 flex flex-col space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalle de la orden</h1>
        <Button variant="outline" asChild>
          <Link href="/comprador/ordenes" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </Button>
      </div>

      {/* Items de la orden */}
      {orden.items.map((item) => {
        const productOrKit = item.product || item.kit;
        if (!productOrKit) return null;

        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.product ? "Producto" : "Kit"}</CardTitle>
              <CardDescription>
                Información del artículo adquirido
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-start gap-6">
              <div className="relative w-40 h-40 flex-shrink-0">
                <Image
                  src={productOrKit.images[0] || ""}
                  alt={productOrKit.name}
                  fill
                  className="object-contain rounded-md border"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{productOrKit.name}</h2>
                {item.product && (
                  <>
                    <p className="text-sm text-gray-600">
                      {item.product.brand} {item.product.model} •{" "}
                      {item.product.year}
                    </p>
                    <Badge variant="outline" className="w-fit">
                      {item.product.condition}
                    </Badge>
                  </>
                )}
                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Estado de la orden */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de la orden</CardTitle>
          <CardDescription>Información de pago y envío</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span>
              Estado:{" "}
              <Badge variant="outline" className="ml-1 capitalize">
                {orden.status}
              </Badge>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="capitalize">Envío: {orden.shippingStatus}</span>
          </div>
          {orden.trackingNumber && (
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
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
              <Truck className="w-4 h-4 text-gray-500" />
              <span>Proveedor: {orden.shippingProvider}</span>
            </div>
          )}

          <div className="col-span-full flex flex-col gap-4">
            <h2 className="font-semibold">Seguimiento del paquete</h2>

            <OrderTracking trackingNumber={orden.trackingNumber} />
          </div>
        </CardContent>
      </Card>

      {/* Detalles de pago */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de pago</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <DollarSign className="w-4 h-4 text-gray-500" /> Total pagado: €
            {total}
          </div>
        </CardContent>
      </Card>

      {/* Datos de envío */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de envío</CardTitle>
          <CardDescription>Dirección y contacto</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-gray-700">
          {orden.shippingName && (
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" /> {orden.shippingName}
            </p>
          )}
          {orden.shippingPhone && (
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" /> {orden.shippingPhone}
            </p>
          )}
          {orden.shippingAddressLine1 ? (
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />{" "}
              {orden.shippingAddressLine1}{" "}
              {orden.shippingAddressLine2 && ` ${orden.shippingAddressLine2}`} -{" "}
              {orden.shippingCity}, {orden.shippingPostalCode},{" "}
              {orden.shippingCountry}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              No se registró dirección de envío aún
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notas */}
      {orden.buyerNote && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Nota del comprador:</span>{" "}
              {orden.buyerNote}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
