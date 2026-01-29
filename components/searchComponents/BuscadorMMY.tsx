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
    <div className="flex flex-col sm:flex-row w-full max-w-4xl mx-auto items-stretch gap-0 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Marca */}
      <div className="flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-100">
        <Select
          value={marca}
          onValueChange={(v) => {
            setMarca(v);
            setModeloId(null);
            setModeloNombre("");
            setYear("");
          }}
        >
          <SelectTrigger className="h-14 w-full border-0 focus:ring-0 focus:ring-offset-0 rounded-none bg-transparent px-4">
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
      </div>

      {/* Modelo */}
      <div className="flex-[1.5] min-w-0 border-b sm:border-b-0 sm:border-r border-gray-100">
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
          <SelectTrigger className="h-14 w-full border-0 focus:ring-0 focus:ring-offset-0 rounded-none bg-transparent px-4">
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
      </div>

      {/* Año */}
      <div className="flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-100">
        <Select value={year} onValueChange={(v) => setYear(v)} disabled={!modeloId || aniosFiltrados.length === 0}>
          <SelectTrigger className="h-14 w-full border-0 focus:ring-0 focus:ring-offset-0 rounded-none bg-transparent px-4">
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
      </div>

      {/* Botón buscar */}
      <Button
        className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all rounded-none sm:w-auto"
        disabled={!marca || !modeloNombre || !year}
        onClick={buscar}
      >
        Buscar
      </Button>
    </div>
  );
}
