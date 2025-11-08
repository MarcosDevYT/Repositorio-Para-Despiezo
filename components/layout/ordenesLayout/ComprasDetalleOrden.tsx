"use client";

import { EntregadoButton } from "@/components/EntregadoButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  DollarSign,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OrderTracking } from "./OrderTracking";
import { OrdenFull } from "@/types/ProductTypes";
import { ReviewForm } from "@/components/formularios/ReviewForm";
import { CompatibilidadForm } from "@/components/formularios/CompatibilidadForm";
import { useEffect, useState } from "react";
import {
  checkReviewExists,
  checkCompatibilidadExists,
} from "@/actions/review-actions";

export const ComprasDetalleOrden = ({ orden }: { orden: OrdenFull }) => {
  const [delivered, setDelivered] = useState(
    orden.shippingStatus === "delivered"
  );
  const [hasReview, setHasReview] = useState(false);
  const [hasCompatibilidad, setHasCompatibilidad] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(true);
  const [isCheckingCompatibilidad, setIsCheckingCompatibilidad] =
    useState(true);

  const total = (orden.amountTotal / 100).toFixed(2);

  // Verificar si ya existe review
  useEffect(() => {
    const checkReview = async () => {
      if (delivered) {
        setIsCheckingReview(true);
        const exists = await checkReviewExists(orden.id);
        setHasReview(exists);
        setIsCheckingReview(false);
      }
    };
    checkReview();
  }, [delivered, orden.id]);

  // Verificar si ya existe compatibilidad para todos los productos
  useEffect(() => {
    const checkCompatibilidad = async () => {
      if (delivered) {
        setIsCheckingCompatibilidad(true);

        // Extraer todos los product IDs
        const productIds: string[] = [];

        if (orden.orderType === "PRODUCT") {
          orden.items.forEach((item) => {
            productIds.push(item.productId);
          });
        } else if (orden.orderType === "KIT") {
          orden.items.forEach((item) => {
            productIds.push(item.productId);
          });
        }

        // Verificar si todos los productos tienen compatibilidad
        const checks = await Promise.all(
          productIds.map((id) => checkCompatibilidadExists(orden.id, id))
        );

        // Si todos tienen compatibilidad registrada
        setHasCompatibilidad(checks.every((check) => check === true));
        setIsCheckingCompatibilidad(false);
      }
    };
    checkCompatibilidad();
  }, [delivered, orden.id, orden.orderType, orden.items]);

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
              <CardTitle className="text-lg font-semibold">
                {item.product ? "Producto" : "Kit"}
              </CardTitle>
              <CardDescription>
                Información del artículo adquirido
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-start gap-6">
              <div className="relative w-40 h-40 shrink-0">
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
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Estado de la orden
            </CardTitle>
            <CardDescription>Información de pago y envío</CardDescription>
          </div>
          <EntregadoButton
            delivered={delivered}
            setDelivered={setDelivered}
            orden={orden}
          />
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

      {delivered && (
        <>
          {/* Formulario de Reseña */}
          {isCheckingReview ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin size-4" />
                  <span>Verificando reseña...</span>
                </div>
              </CardContent>
            </Card>
          ) : hasReview ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    Ya has dejado una reseña para esta orden
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Formulario de Reseña
                </CardTitle>
                <CardDescription>
                  Dejá tu reseña sobre el producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  orden={orden}
                  onSuccess={() => setHasReview(true)}
                />
              </CardContent>
            </Card>
          )}

          {/* Formulario de Compatibilidad */}
          {isCheckingCompatibilidad ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin size-4" />
                  <span>Verificando compatibilidad...</span>
                </div>
              </CardContent>
            </Card>
          ) : hasCompatibilidad ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    Ya has registrado la compatibilidad para esta orden
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Formulario de Compatibilidad
                </CardTitle>
                <CardDescription>Información de compatibilidad</CardDescription>
              </CardHeader>
              <CardContent>
                <CompatibilidadForm orden={orden} />
              </CardContent>
            </Card>
          )}
        </>
      )}

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
          <CardTitle className="text-lg font-semibold">
            Datos de envío
          </CardTitle>
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
            <CardTitle className="text-lg font-semibold">Notas</CardTitle>
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
};
