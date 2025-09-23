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
    <section
      className="w-full h-[70vh] flex flex-col items-center justify-center text-white space-y-8 px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 100, 0.5), rgba(0, 0, 0, 0.6)), url(${heroInfo.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Encuentra la pieza que necesitas
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          Busca por matrícula, referencia OEM. Miles de piezas de vehículos al
          mejor precio.
        </p>
      </div>
      <div className="flex justify-center">
        <Card className="p-2 w-full">
          {/* Select para pantallas pequeñas */}
          <div className="md:hidden">
            <Select
              value={selectedVehicleType}
              onValueChange={(value: "coche" | "moto" | "furgoneta") =>
                setSelectedVehicleType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tipo de vehículo" />
              </SelectTrigger>
              <SelectContent align="center">
                {vehicleTypes.map((type) => {
                  const Icon = type.icon;

                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Botones para pantallas md y mayores */}
          <div className="hidden md:flex space-x-2 justify-center">
            {vehicleTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={
                    selectedVehicleType === type.id ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => setSelectedVehicleType(type.id)}
                  className="flex items-center space-x-2"
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
      <SearchOEMAndVehiculo tipoDeVehiculo={selectedVehicleType} />
    </section>
  );
}
