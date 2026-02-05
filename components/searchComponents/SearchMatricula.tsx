"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Search, Loader2, Car, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchByMatricula, type MatriculaResponseSolvedia, type VehicleVersion } from "@/actions/matricula-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SearchMatricula = () => {
  const [matricula, setMatricula] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState<VehicleVersion[]>([]);
  const [searchResult, setSearchResult] = useState<MatriculaResponseSolvedia | null>(null);
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

  const handleSelectVersion = async (version: VehicleVersion, index: number) => {
    setShowVersionModal(false);
    setIsLoading(true);
    setProgress(90);

    const basePlate = matricula.trim().toLowerCase().split("-")[0];
    const selectedPlate = index === 0 ? basePlate : `${basePlate}-${index}`;
    
    // Extraer marca del versionName
    const marca = version.versionName.split(" ")[0];
    
    // Extraer modelo
    const modelo = version.versionName.split(" ").slice(1, 3).join(" ");
    
    // Extraer año
    const year = version.details["Año de fabricación (desde - hasta)"];

    await completeProgress();
    setIsLoading(false);
    setProgress(0);

    const searchParams = new URLSearchParams();
    if (marca) searchParams.set("marca", marca);
    if (modelo) searchParams.set("modelo", modelo);
    if (year) searchParams.set("año", year);
    searchParams.set("matricula", selectedPlate);
    
    router.push(`/productos?${searchParams.toString()}`);
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
          setIsLoading(false);
          setProgress(0);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          toast.error("error" in result ? result.error : "Error desconocido");
          return;
        }

        // Si tiene múltiples versiones, mostramos el modal
        if ("data" in result && "processedVersions" in result.data && result.data.processedVersions.length > 1) {
          setVersions(result.data.processedVersions);
          setSearchResult(result as MatriculaResponseSolvedia);
          
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          setIsLoading(false);
          setProgress(0);
          setShowVersionModal(true);
          return;
        }

        toast.success("Matrícula encontrada");
        
        // Extraer marca del fullName
        const isOscaro = "version" in result.data && "label" in result.data;
        let fullName = "";
        let details: any = null;

        if (isOscaro) {
          fullName = (result.data as any).fullName;
        } else {
          fullName = (result as MatriculaResponseSolvedia).data.processedVersions[0].versionName;
          details = (result as MatriculaResponseSolvedia).data.processedVersions[0].details;
        }

        const marca = fullName.split(" ")[0];
        let modelo = "";
        let year = "";
        
        if (isOscaro) {
          const parts = fullName.split(" ");
          modelo = parts.slice(1, 3).join(" ");
          const oscaroData = result.data as any;
          const yearMatch = oscaroData.version?.match(/\b(19|20)\d{2}\b/);
          year = yearMatch ? yearMatch[0] : "";
        } else {
          modelo = fullName.split(" ").slice(1, 3).join(" ");
          if (details && details["Año de fabricación (desde - hasta)"]) {
            year = details["Año de fabricación (desde - hasta)"];
          }
        }

        await completeProgress();
        setIsLoading(false);
        setProgress(0);

        const searchParams = new URLSearchParams();
        if (marca) searchParams.set("marca", marca);
        if (modelo) searchParams.set("modelo", modelo);
        if (year) searchParams.set("año", year);
        searchParams.set("matricula", matricula.toLowerCase());
        
        router.push(`/productos?${searchParams.toString()}`);
      } catch (error) {
        console.error(error);
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

      <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Múltiples versiones encontradas</DialogTitle>
            <DialogDescription>
              Hemos encontrado varias versiones para la matrícula <strong>{matricula}</strong>. 
              Por favor, selecciona la que corresponde a tu vehículo.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] mt-4 pr-4">
            <div className="grid gap-3">
              {versions.map((version, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectVersion(version, index)}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <Car className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {version.versionName}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                        <span><strong>Motor:</strong> {version.details.Tipo}</span>
                        <span><strong>Año:</strong> {version.details["Año de fabricación (desde - hasta)"]}</span>
                        <span><strong>Potencia:</strong> {version.details["Potencia [cv]"]} CV</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
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
