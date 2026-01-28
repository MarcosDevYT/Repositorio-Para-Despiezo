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
import { Input } from "@/components/ui/input";
import { useMarcas } from "@/hooks/use-marcas";
import { Loader2 } from "lucide-react";

export function BuscadorMMY() {
  const router = useRouter();
  const { marcas, loading: marcasLoading } = useMarcas();

  const [marca, setMarca] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [year, setYear] = useState<string>("");

  // Generar años desde 1990 hasta el año actual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) =>
    String(currentYear - i)
  );

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
          {marcasLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            marcas.map((m) => (
              <SelectItem key={m.id} value={m.marca}>
                {m.marca}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Modelo */}
      <Input
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
        placeholder="Modelo"
        className="rounded-none border-x-0 w-40 h-9"
        disabled={!marca}
      />

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
