"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Car, Gauge, Fuel, Settings, Calendar, Zap, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: {
    plate: string;
    fullName: string;
    source: string;
    title: string;
    tipo?: string | null;
    yearRange?: string | null;
    bodyType?: string | null;
    powerHp?: string | null;
    powerKw?: string | null;
    displacement?: string | null;
    cylinders?: string | null;
    engineCode?: string | null;
    fuelType?: string | null;
    transmission?: string | null;
    engineType?: string | null;
  };
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 shadow-xl">
      {/* Header con fondo degradado */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  {vehicle.fullName}
                </h2>
                <p className="text-sm text-white/90 mt-1">
                  {vehicle.title}
                </p>
              </div>
            </div>
          </div>
          
          <Badge className="bg-white text-primary hover:bg-white/90 font-bold text-base px-4 py-2">
            {vehicle.plate.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Contenido con especificaciones */}
      <CardContent className="p-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="space-y-4">
          {/* Grid principal de especificaciones */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {vehicle.yearRange && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Año</span>
                </div>
                <p className="text-lg font-bold">{vehicle.yearRange}</p>
              </div>
            )}

            {vehicle.bodyType && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Carrocería</span>
                </div>
                <p className="text-lg font-bold">{vehicle.bodyType}</p>
              </div>
            )}

            {vehicle.powerHp && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Potencia</span>
                </div>
                <p className="text-lg font-bold">
                  {vehicle.powerHp}
                  {vehicle.powerKw && (
                    <span className="text-sm text-muted-foreground ml-1">
                      ({vehicle.powerKw})
                    </span>
                  )}
                </p>
              </div>
            )}

            {vehicle.displacement && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Gauge className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Cilindrada</span>
                </div>
                <p className="text-lg font-bold">{vehicle.displacement}</p>
              </div>
            )}

            {vehicle.fuelType && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Fuel className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Combustible</span>
                </div>
                <p className="text-lg font-bold">{vehicle.fuelType}</p>
              </div>
            )}

            {vehicle.engineCode && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Código Motor</span>
                </div>
                <p className="text-lg font-bold">{vehicle.engineCode}</p>
              </div>
            )}

            {vehicle.transmission && vehicle.transmission !== "---" && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Cog className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Transmisión</span>
                </div>
                <p className="text-lg font-bold">{vehicle.transmission}</p>
              </div>
            )}

            {vehicle.cylinders && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Gauge className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Cilindros</span>
                </div>
                <p className="text-lg font-bold">{vehicle.cylinders}</p>
              </div>
            )}
          </div>

          {/* Footer con mensaje */}
          <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                <span className="text-primary text-xs">✓</span>
              </span>
              Mostrando repuestos compatibles con tu vehículo
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
