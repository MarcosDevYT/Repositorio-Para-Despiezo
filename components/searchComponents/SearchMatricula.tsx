"use client";

import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchByMatricula } from "@/actions/matricula-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SearchMatricula = () => {
  const [matricula, setMatricula] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = () => {
    if (!matricula.trim()) {
      toast.error("Por favor ingresa una matrícula");
      return;
    }

    startTransition(async () => {
      try {
        const result = await searchByMatricula(matricula);

        if (!result.success) {
          toast.error("error" in result ? result.error : "Error desconocido");
          return;
        }

        toast.success("Matrícula encontrada");
        
        // Extraer marca del fullName (ej: "TOYOTA Corolla Cross..." o "VOLKSWAGEN Touran III...")
        const marca = result.data.fullName.split(" ")[0];
        
        // Extraer modelo - varía según el formato
        let modelo = "";
        let year = "";
        
        // Detectar si es formato Oscaro (tiene version y label)
        const isOscaro = "version" in result.data && "label" in result.data;
        
        if (isOscaro) {
          // Formato Oscaro: VOLKSWAGEN Touran III 2.0 TDI...
          // Extraer modelo de label o fullName
          const parts = result.data.fullName.split(" ");
          modelo = parts.slice(1, 3).join(" "); // ej: "Touran III"
          
          // Intentar extraer año de version si existe
          const oscaroData = result.data as any;
          const yearMatch = oscaroData.version?.match(/\b(19|20)\d{2}\b/);
          year = yearMatch ? yearMatch[0] : "";
        } else {
          // Formato Solvedia/Autodoc con details
          modelo = result.data.fullName.split(" ").slice(1, 3).join(" ");
          
          // Extraer año del campo "Año de fabricación"
          const details = result.data as any;
          if (details.details && details.details["Año de fabricación (desde - hasta)"]) {
            const yearMatch = details.details["Año de fabricación (desde - hasta)"].match(/(\d{2})\.(\d{4})/);
            year = yearMatch ? yearMatch[2] : "";
          }
        }

        // Redirigir a productos con los parámetros de búsqueda Y la matrícula
        const searchParams = new URLSearchParams();
        if (marca) searchParams.set("marca", marca);
        if (modelo) searchParams.set("modelo", modelo);
        if (year) searchParams.set("año", year);
        searchParams.set("matricula", matricula.toLowerCase());
        
        router.push(`/productos?${searchParams.toString()}`);
      } catch (error) {
        console.error(error);
        toast.error("Error al procesar la búsqueda");
      }
    });
  };

  return (
    <div className="max-w-2xl w-full bg-white p-2 rounded-lg">
      <div className="flex space-x-2 items-center w-full">
        <Input
          value={matricula}
          onChange={(e) => setMatricula(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="Ej: 2349LYK"
          className="flex-1 h-10 text-sm text-gray-700 uppercase"
          maxLength={10}
          disabled={isPending}
        />

        <Button
          type="button"
          onClick={handleSearch}
          disabled={!matricula.trim() || isPending}
          className="px-8"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Search className="size-5" />
          )}
          <span className="hidden md:flex">Buscar</span>
        </Button>
      </div>
    </div>
  );
};
