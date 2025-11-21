"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Tipado completo
type Vehicles = {
  [marca: string]: {
    [modelo: string]: {
      [year: string]: any[];
    };
  };
};

const vehicles: Vehicles = {
  Toyota: {
    Corolla: {
      "2014": [],
      "2015": [],
    },
    Hilux: {
      "2018": [],
    },
  },
  Honda: {
    Civic: {
      "2016": [],
    },
  },
};

export function BuscadorMMY() {
  const router = useRouter();

  const [marca, setMarca] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const marcas = Object.keys(vehicles);
  const modelos = marca ? Object.keys(vehicles[marca]) : [];
  const years = marca && modelo ? Object.keys(vehicles[marca][modelo]) : [];

  const buscar = () => {
    if (!marca || !modelo || !year) return;

    router.push(
      `/productos?marca=${encodeURIComponent(
        marca
      )}&modelo=${encodeURIComponent(modelo)}&año=${encodeURIComponent(year)}`
    );
  };

  return (
    <Card className="flex flex-row gap-0 px-2 py-2 w-full max-w-3xl mx-auto items-center">
      {/* Marca */}
      <Select
        value={marca}
        onValueChange={(v) => {
          setMarca(v);
          setModelo("");
          setYear("");
        }}
      >
        <SelectTrigger className="rounded-none rounded-l-md border-r-0 w-40">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          {marcas.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Modelo */}
      <Select
        value={modelo}
        onValueChange={(v) => {
          setModelo(v);
          setYear("");
        }}
        disabled={!marca}
      >
        <SelectTrigger className="rounded-none border-x-0 w-40">
          <SelectValue placeholder="Modelo" />
        </SelectTrigger>
        <SelectContent>
          {modelos.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Año */}
      <Select value={year} onValueChange={(v) => setYear(v)} disabled={!modelo}>
        <SelectTrigger className="rounded-none border-l-0 w-32">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botón buscar */}
      <Button
        className="rounded-l-none h-9"
        disabled={!marca || !modelo || !year}
        onClick={buscar}
      >
        Buscar
      </Button>
    </Card>
  );
}
