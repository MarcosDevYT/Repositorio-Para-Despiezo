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
import { useModelos } from "@/hooks/use-modelos";
import { Loader2 } from "lucide-react";

export function BuscadorMMY() {
  const router = useRouter();
  const { marcas, loading: marcasLoading } = useMarcas();
  const { getModelosByMarca, getAniosByModelo, loading: modelosLoading } = useModelos();

  const [marca, setMarca] = useState<string>("");
  const [modeloId, setModeloId] = useState<number | null>(null);
  const [modeloNombre, setModeloNombre] = useState<string>("");
  const [year, setYear] = useState<string>("");

  // Obtener modelos filtrados por marca seleccionada
  const modelosFiltrados = marca ? getModelosByMarca(marca) : [];
  
  // Obtener años filtrados por modelo seleccionado
  const aniosFiltrados = marca && modeloId ? getAniosByModelo(marca, modeloId) : [];

  const buscar = () => {
    if (!marca || !modeloNombre || !year) return;

    // Extraer solo el nombre del modelo sin las fechas
    const modeloLimpio = modeloNombre.replace(/\s*\([^)]*\)\s*$/, "").trim();

    router.push(
      `/productos?marca=${encodeURIComponent(
        marca
      )}&modelo=${encodeURIComponent(modeloLimpio)}&año=${encodeURIComponent(year)}`
    );
  };

  return (
    <Card className="flex flex-row gap-0 px-2 py-2 w-full max-w-3xl mx-auto items-center">
      {/* Marca */}
      <Select
        value={marca}
        onValueChange={(v) => {
          setMarca(v);
          setModeloId(null);
          setModeloNombre("");
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
      <Select
        value={modeloId?.toString() || ""}
        onValueChange={(v) => {
          const id = parseInt(v, 10);
          setModeloId(id);
          const modelo = modelosFiltrados.find((m) => m.id === id);
          setModeloNombre(modelo?.modelo || "");
          setYear("");
        }}
        disabled={!marca || modelosLoading}
      >
        <SelectTrigger className="rounded-none border-x-0 w-48 h-9">
          <SelectValue placeholder={modelosLoading ? "Cargando..." : "Modelo"} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {modelosFiltrados.map((m) => (
            <SelectItem key={m.id} value={m.id.toString()}>
              {m.modelo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Año */}
      <Select value={year} onValueChange={(v) => setYear(v)} disabled={!modeloId || aniosFiltrados.length === 0}>
        <SelectTrigger className="rounded-none border-l-0 w-32">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {aniosFiltrados.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botón buscar */}
      <Button
        className="rounded-l-none h-9"
        disabled={!marca || !modeloNombre || !year}
        onClick={buscar}
      >
        Buscar
      </Button>
    </Card>
  );
}
