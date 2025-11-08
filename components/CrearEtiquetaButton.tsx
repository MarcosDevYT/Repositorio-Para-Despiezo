"use client";

import { createEtiqueta, getPDFParcel } from "@/actions/order-actions";
import { Button } from "./ui/button";
import { File, Loader2, Printer } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OrdenFull } from "@/types/ProductTypes";

export const CrearEtiquetaButton = ({ orden }: { orden: OrdenFull }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEtiquetaGenerada, setIsEtiquetaGenerada] = useState(false);

  console.log(orden);

  const handleSend = () => {
    startTransition(async () => {
      try {
        // Construimos los parcel_items
        const parcelItems = orden.items.map((item) => {
          const source = item.product || item.kit;

          return {
            description: source.name,
            quantity: item.quantity || 1,
            weight: source.weight?.toString() || "0",
            value: Number(source.price) || 0,
            origin_country: "ES",
            sku: source.oemNumber || source.id,
          };
        });

        const totalWeight = orden.items.reduce(
          (acc, item) => acc + (item.product?.weight || item.kit?.weight || 0),
          0
        );

        const parcelData = {
          parcel: {
            name: orden.shippingName,
            company_name: "Sendcloud",
            address: orden.shippingAddressLine1,
            house_number: orden.shippingAddressLine2,
            address_2: "",
            city: orden.shippingCity,
            postal_code: orden.shippingPostalCode,
            country: "ES",
            telephone: orden.shippingPhone,
            email: orden.buyer?.email,
            shipment: { id: 8 },
            order_number: orden.id,
            request_label: true,
            insured_value: orden.amountTotal / 100,
            total_order_value_currency: "EUR",
            total_order_value: (orden.amountTotal / 100).toString(),
            quantity: 1,
            shipping_method_checkout_name: "DHL Express Domestic",
            weight: totalWeight,
            parcel_items: parcelItems,
            apply_shipping_rules: true,
          },
        };

        console.log(parcelData);

        await createEtiqueta(parcelData);
        setIsEtiquetaGenerada(true);
        router.refresh();
        toast.success("Se ha generado la etiqueta correctamente.");
      } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error al generar la etiqueta.");
      }
    });
  };

  const handleGetPDF = () => {
    startTransition(async () => {
      try {
        // Llamamos al server action que devuelve Buffer
        const pdfBuffer = await getPDFParcel(orden.id);

        // Convertimos a Blob y descargamos
        const blob = new Blob([pdfBuffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `etiqueta_${orden.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("PDF descargado correctamente.");
      } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error al descargar el PDF.");
      }
    });
  };

  useEffect(() => {
    if (orden.trackingNumber) {
      setIsEtiquetaGenerada(true);
    }
  }, [orden.trackingNumber]);

  return isEtiquetaGenerada ? (
    <Button
      onClick={handleGetPDF}
      disabled={isPending}
      className="bg-green-500 hover:bg-green-600"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Obteniendo PDF...
        </>
      ) : (
        <>
          <File className="size-4" /> Imprimir PDF
        </>
      )}
    </Button>
  ) : (
    <Button
      onClick={handleSend}
      disabled={isPending}
      className="flex items-center justify-center gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generando etiqueta...
        </>
      ) : (
        <>
          <Printer className="w-4 h-4" />
          Generar etiqueta
        </>
      )}
    </Button>
  );
};
