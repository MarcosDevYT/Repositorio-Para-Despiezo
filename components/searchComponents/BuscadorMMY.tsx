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
import { Button } from "@/components/ui/button";
import { useMarcas } from "@/hooks/use-marcas";
import { useModelos } from "@/hooks/use-modelos";
import { Loader2, Search } from "lucide-react";

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
    <div className="max-w-2xl w-full bg-white p-2 rounded-lg">
      <div className="flex space-x-2 items-center w-full">
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
          <SelectTrigger className="h-10 flex-1 min-w-0 text-sm text-gray-700">
            {marcasLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SelectValue placeholder="Marca" />
            )}
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {marcas.map((m) => (
              <SelectItem key={m.id} value={m.marca}>
                {m.marca}
              </SelectItem>
            ))}
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
          <SelectTrigger className="h-10 flex-[1.5] min-w-0 text-sm text-gray-700">
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
          <SelectTrigger className="h-10 w-[90px] min-w-[90px] text-sm text-gray-700">
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
          className="px-8"
          disabled={!marca || !modeloNombre || !year}
          onClick={buscar}
        >
          <Search className="size-5" />
          <span className="hidden md:flex">Buscar</span>
        </Button>
      </div>
    </div>
  );
}
