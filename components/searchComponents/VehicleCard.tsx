"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Car, Gauge, Fuel, Settings, Calendar, Zap, Cog, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface VehicleVariation {
  plate: string;
  fullName: string;
  index: number;
}

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
    availableVariations?: VehicleVariation[];
  };
  onSwitchVariation?: (newPlate: string) => void;
}

export const VehicleCard = ({ vehicle, onSwitchVariation }: VehicleCardProps) => {
  // Función para procesar el año y detectar si termina en "..."
  const processYear = (yearRange: string | null | undefined) => {
    if (!yearRange) return null;
    if (yearRange.endsWith('...')) {
      const startYear = yearRange.replace('...', '').trim();
      return {
        display: startYear,
        isCurrent: true
      };
    }
    return {
      display: yearRange,
      isCurrent: false
    };
  };

  const yearInfo = processYear(vehicle.yearRange);

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 shadow-xl">
      {/* Selector de Variación si es necesario */}
      {vehicle.plate.includes("-") && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 font-bold">
            Variación seleccionada
          </Badge>
        </div>
      )}
      {/* Header con fondo degradado */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 text-white">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                {vehicle.fullName}
              </h2>
              {vehicle.availableVariations && vehicle.availableVariations.length > 1 && onSwitchVariation && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-[10px] text-white/90 hover:text-white hover:bg-white/10 border border-white/20 rounded-md gap-1 font-bold uppercase"
                    >
                      Cambiar versión
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px]">
                    {vehicle.availableVariations.map((v) => (
                      <DropdownMenuItem 
                        key={v.plate}
                        onClick={() => onSwitchVariation(v.plate)}
                        className={`text-xs py-2 cursor-pointer ${v.plate === vehicle.plate ? 'bg-primary/10 font-bold text-primary' : ''}`}
                      >
                        <Car className="mr-2 h-3.5 w-3.5" />
                        <span className="line-clamp-2">{v.fullName}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <Badge className="bg-white text-primary hover:bg-white/90 font-bold text-sm px-3 py-1.5 shrink-0 self-start">
              {vehicle.plate.includes("-") ? vehicle.plate.split("-")[0].toUpperCase() : vehicle.plate.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
              <Car className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-white/80 uppercase">Ficha Técnica</span>
          </div>
        </div>
      </div>

      {/* Contenido con especificaciones */}
      <CardContent className="p-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="space-y-4">
          {/* Grid principal de especificaciones */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {yearInfo && (
              <div className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Año</span>
                </div>
                <p className="text-base font-bold break-words">
                  {yearInfo.display}{yearInfo.isCurrent && <span > actual 2026</span>}
                </p>
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
                <p className="text-base font-bold truncate">{vehicle.bodyType}</p>
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
                <p className="text-base font-bold truncate">
                  {vehicle.powerHp}
                  {vehicle.powerKw && (
                    <span className="text-xs text-muted-foreground ml-1">
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
                <p className="text-base font-bold truncate">{vehicle.displacement}</p>
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
                <p className="text-base font-bold truncate" title={vehicle.fuelType}>
                  {vehicle.fuelType}
                </p>
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
                <p className="text-base font-bold truncate">{vehicle.engineCode}</p>
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
                <p className="text-base font-bold truncate">{vehicle.transmission}</p>
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
                <p className="text-base font-bold truncate">{vehicle.cylinders}</p>
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
