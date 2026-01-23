"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchByMatricula } from "@/actions/matricula-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export const SearchMatricula = () => {
  const [matricula, setMatricula] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const startProgressAnimation = () => {
    setProgress(0);
    const duration = 15000; // 15 segundos
    const targetProgress = 90; // Máximo 90%
    const intervalTime = 100; // Actualizar cada 100ms
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    progressIntervalRef.current = setInterval(() => {
      currentStep++;
      
      // Progreso con variación aleatoria para hacerlo más natural
      const baseProgress = (currentStep / totalSteps) * targetProgress;
      const randomVariation = Math.random() * 2 - 1; // -1 a +1
      const newProgress = Math.min(targetProgress, baseProgress + randomVariation);
      
      setProgress(newProgress);

      // Detener cuando llegue al objetivo
      if (currentStep >= totalSteps) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }, intervalTime);
  };

  const completeProgress = async () => {
    // Detener la animación de progreso actual
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Llevar a 100% rápidamente
    setProgress(100);

    // Esperar 1 segundo mostrando el 100%
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSearch = () => {
    if (!matricula.trim()) {
      toast.error("Por favor ingresa una matrícula");
      return;
    }

    setIsLoading(true);
    startProgressAnimation();

    startTransition(async () => {
      try {
        const result = await searchByMatricula(matricula);

        if (!result.success) {
          // Resetear estados en caso de error
          setIsLoading(false);
          setProgress(0);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
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

        // Completar progreso a 100% y esperar 1 segundo
        await completeProgress();

        // Resetear estados
        setIsLoading(false);
        setProgress(0);

        // Redirigir a productos con los parámetros de búsqueda Y la matrícula
        const searchParams = new URLSearchParams();
        if (marca) searchParams.set("marca", marca);
        if (modelo) searchParams.set("modelo", modelo);
        if (year) searchParams.set("año", year);
        searchParams.set("matricula", matricula.toLowerCase());
        
        router.push(`/productos?${searchParams.toString()}`);
      } catch (error) {
        console.error(error);
        // Resetear estados en caso de error
        setIsLoading(false);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        toast.error("Error al procesar la búsqueda");
      }
    });
  };

  return (
    <>
      <LoadingOverlay 
        isLoading={isLoading} 
        progress={progress}
        message="Buscando vehículo..."
      />
      
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
            disabled={isPending || isLoading}
          />

          <Button
            type="button"
            onClick={handleSearch}
            disabled={!matricula.trim() || isPending || isLoading}
            className="px-8 min-w-[120px] relative"
          >
            <div className="flex items-center justify-center gap-2">
              {isPending || isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Search className="size-5" />
              )}
              <span className="hidden md:inline">Buscar</span>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};
