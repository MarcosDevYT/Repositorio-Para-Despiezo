"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bike, Car, Truck } from "lucide-react";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchOEMAndVehiculo } from "@/components/searchComponents/SearchOEMAndVehiculo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuscadorMMY } from "@/components/searchComponents/BuscadorMMY";

const heroInfo = {
  id: 1,
  image: "/hero-banner.jpg",
  title: "Encuentra las mejores partes para tu auto",
  subtitle: "Partes de segunda mano verificadas y garantizadas",
  cta: "Explorar Productos",
  link: "/productos",
};

export function Hero() {
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    "coche" | "moto" | "furgoneta"
  >("coche");

  const vehicleTypes = [
    { id: "coche" as const, label: "Coche", icon: Car },
    { id: "furgoneta" as const, label: "Furgoneta", icon: Truck },
    { id: "moto" as const, label: "Moto", icon: Bike },
  ];

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[75vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background con overlay mejorado */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroInfo.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Título y subtítulo con mejor jerarquía */}
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Miles de repuestos verificados disponibles
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Encuentra la pieza
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
              que necesitas
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-blue-50 max-w-2xl mx-auto font-light leading-relaxed">
            Busca por referencia OEM o por marca/modelo/año. Los mejores precios en autopartes de calidad verificada.
          </p>
        </div>

        {/* Tabs de búsqueda mejorados */}
        <Tabs defaultValue="oem" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-1">
            <TabsTrigger 
              value="oem" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary font-semibold rounded-lg transition-all"
            >
              Búsqueda por OEM
            </TabsTrigger>
            <TabsTrigger 
              value="mmy"
              className="data-[state=active]:bg-white data-[state=active]:text-primary font-semibold rounded-lg transition-all"
            >
              Marca/Modelo/Año
            </TabsTrigger>
          </TabsList>

          <TabsContent value="oem" className="w-full space-y-4 mt-0">
            {/* Selector de tipo de vehículo */}
            <div className="flex justify-center">
              <Card className="p-1.5 border-white/20 bg-white/95 backdrop-blur-sm shadow-xl">
                {/* Select para pantallas pequeñas */}
                <div className="md:hidden">
                  <Select
                    value={selectedVehicleType}
                    onValueChange={(value: "coche" | "moto" | "furgoneta") =>
                      setSelectedVehicleType(value)
                    }
                  >
                    <SelectTrigger className="w-full min-w-[200px] border-0 font-medium">
                      <SelectValue placeholder="Selecciona un tipo de vehículo" />
                    </SelectTrigger>
                    <SelectContent align="center">
                      {vehicleTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Botones para pantallas md y mayores */}
                <div className="hidden md:flex space-x-1.5">
                  {vehicleTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={selectedVehicleType === type.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedVehicleType(type.id)}
                        className="flex items-center gap-2 px-6 font-medium transition-all hover:scale-105"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Buscador principal */}
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <SearchOEMAndVehiculo tipoDeVehiculo={selectedVehicleType} />
            </div>
          </TabsContent>

          <TabsContent value="mmy" className="mt-0">
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <BuscadorMMY />
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats o confianza */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-6 text-white">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-base">+10,000 piezas verificadas</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-base">Compra 100% segura</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-base">Envío rápido</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
}
