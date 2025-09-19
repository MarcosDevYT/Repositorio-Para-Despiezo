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
  FileText,
  ArrowLeft,
  Mail,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CrearEtiquetaButton } from "@/components/CrearEtiquetaButton";
import { ChatCompradorButton } from "@/components/ChatCompradorButton";

export default async function VentasIDOrden({
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
          <Link href="/vendedor/ventas">Volver a ventas</Link>
        </Button>
      </div>
    );
  }

  const product = orden.product;
  const total = (orden.amountTotal / 100).toFixed(2);
  const vendorAmount = (orden.vendorAmount / 100).toFixed(2);
  const fee = (orden.feeAmount / 100).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de la orden</h1>
        <Button variant="outline" asChild>
          <Link href="/vendedor/ventas" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </Button>
      </div>

      {/* Acciones rápidas */}
      <Card className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between">
        <CardHeader className="flex flex-col flex-1 items-center justify-center lg:justify-start lg:items-start w-full">
          <CardTitle className=" text-center lg:text-start">Acciones</CardTitle>
          <CardDescription className="w-full text-center lg:text-start">
            Gestionar venta rápidamente
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-2">
          <CrearEtiquetaButton orden={orden} />
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Marcar como enviado
          </Button>
          <ChatCompradorButton orden={orden} />
        </CardContent>
      </Card>

      {/* Layout principal: desktop 2 columnas, mobile 1 columna */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna izquierda: info de orden */}
        <div className="flex-1 space-y-6 order-2 md:order-1">
          {/* Estado de la orden */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de la orden</CardTitle>
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
                <span className="capitalize">
                  Envío: {orden.shippingStatus}
                </span>
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
            </CardContent>
          </Card>

          {/* Datos de envío */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de envío</CardTitle>
              <CardDescription>
                Dirección y contacto del comprador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {orden.shippingName && (
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />{" "}
                  {orden.shippingName}
                </p>
              )}
              {orden.shippingPhone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />{" "}
                  {orden.shippingPhone}
                </p>
              )}
              {orden.shippingAddressLine1 ? (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {orden.shippingAddressLine1}{" "}
                  {orden.shippingAddressLine2 &&
                    ` ${orden.shippingAddressLine2}`}{" "}
                  - {orden.shippingCity}, {orden.shippingPostalCode},{" "}
                  {orden.shippingCountry}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  No se registró dirección de envío aún
                </p>
              )}
            </CardContent>
          </Card>

          {/* Detalles de pago */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de pago</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <DollarSign className="w-4 h-4 text-gray-500" /> Total
                comprador: €{total}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                Comisión: €{fee}
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                Neto vendedor: €{vendorAmount}
              </div>
            </CardContent>
          </Card>

          {/* Notas */}
          {(orden.buyerNote || orden.vendorNote) && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {orden.buyerNote && (
                  <p>
                    <span className="font-semibold">Nota del comprador:</span>{" "}
                    {orden.buyerNote}
                  </p>
                )}
                {orden.vendorNote && (
                  <p>
                    <span className="font-semibold">Nota del vendedor:</span>{" "}
                    {orden.vendorNote}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna derecha: producto + acciones */}
        <div className="w-full md:w-80 lg:w-sm flex-shrink-0 space-y-6 order-1 md:order-2">
          {/* Producto */}
          <Card>
            <CardHeader>
              <CardTitle>Producto vendido</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain rounded-md border"
                />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">
                  {product.brand} {product.model} • {product.year}
                </p>
                <Badge variant="outline">{product.condition}</Badge>
                <p className="text-sm text-gray-500">
                  OEM: {product.oemNumber || "No especificado"}
                </p>
                <p className="text-sm text-gray-500">{product.location}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
