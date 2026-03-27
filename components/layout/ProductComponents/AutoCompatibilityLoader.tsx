"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AutoCompatibilityLoaderProps {
  productId: string;
  oemNumber: string | null;
  hasCompatibilities: boolean;
}

export function AutoCompatibilityLoader({
  productId,
  oemNumber,
  hasCompatibilities,
}: AutoCompatibilityLoaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Solo activar el scraping si:
    // 1. No tiene compatibilidades
    // 2. Tiene un OEM válido
    // 3. No se ha iniciado ya el proceso
    if (!hasCompatibilities && oemNumber && oemNumber.trim() !== "" && scrapingStatus === "idle") {
      // Registrar el producto en el tracking antes de hacer scraping
      registerTracking();
      triggerCompatibilityScraping();
    }
  }, [hasCompatibilities, oemNumber, scrapingStatus]);

  const registerTracking = async () => {
    try {
      await fetch("/api/oem-tracking/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, oem: oemNumber }),
      });
    } catch (error) {
      console.error("Error al registrar tracking inicial:", error);
    }
  };

  const triggerCompatibilityScraping = async () => {
    if (!oemNumber) return;

    setIsLoading(true);
    setScrapingStatus("loading");

    try {
      const response = await fetch(`https://despiezo.solvedia.app/fastebay/${encodeURIComponent(oemNumber.trim())}`);
      const result = await response.json();

      if (result && result.status === "OK") {
        setScrapingStatus("success");
        
        // Registrar/actualizar el tracking del producto
        try {
          await fetch("/api/oem-tracking/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, oem: oemNumber }),
          });
        } catch (trackingError) {
          console.error("Error al actualizar tracking:", trackingError);
        }
        
        toast.success("Compatibilidades cargadas exitosamente");
        
        // Recargar la página después de 1 segundo para mostrar las compatibilidades
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setScrapingStatus("error");
        // No mostrar error al usuario, simplemente no hay compatibilidades disponibles
      }
    } catch (error) {
      console.error("Error al obtener compatibilidades:", error);
      setScrapingStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Si tiene compatibilidades, no renderizar nada
  if (hasCompatibilities) {
    return null;
  }

  // Si no tiene OEM, no renderizar nada
  if (!oemNumber || oemNumber.trim() === "") {
    return null;
  }

  // Mostrar loader mientras se está cargando
  if (isLoading || scrapingStatus === "loading") {
    return (
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Compatibilidades
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Buscando compatibilidades...
              </p>
              <p className="text-xs text-muted-foreground">
                Estamos consultando la base de datos para el OEM {oemNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si terminó de cargar pero no encontró nada, no mostrar nada
  return null;
}
