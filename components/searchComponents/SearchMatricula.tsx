"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Search, Loader2, Car, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchByMatricula, type MatriculaResponseSolvedia, type VehicleVersion, type AvailableVersion } from "@/actions/matricula-actions";
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
  const [availableVersions, setAvailableVersions] = useState<AvailableVersion[]>([]);
  const [searchResult, setSearchResult] = useState<MatriculaResponseSolvedia | null>(null);
  const router = useRouter();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Funciones para interactuar con el API de logging de placas
  const crearArchivoPlaca = async (placa: string, procesed: boolean) => {
    try {
      const response = await fetch('https://2025.luisredy.com/DespiezoData/api-v3.php/?api=insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: placa.toLowerCase(),
          folder: 'placalog',
          estructura: { placa: placa.toLowerCase(), procesed }
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error({ mensaje: "Error al crear archivo de placa", error });
      return { success: false, message: "Error al crear archivo", error };
    }
  };

  const actualizarArchivoPlaca = async (placa: string, procesed: boolean) => {
    try {
      const response = await fetch('https://2025.luisredy.com/DespiezoData/api-v3.php/?api=update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: placa.toLowerCase(),
          folder: 'placalog',
          estructura: { placa: placa.toLowerCase(), procesed }
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error({ mensaje: "Error al actualizar archivo de placa", error });
      return { success: false, message: "Error al actualizar archivo", error };
    }
  };

  const verificarPlacaEnLog = async (placa: string) => {
    try {
      const response = await fetch(`https://2025.luisredy.com/DespiezoData/api-v3.php/?api=all&folder=placalog`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const placaData = data.find((item: any) => item.placa === placa.toLowerCase());
        return placaData || null;
      }
      return null;
    } catch (error) {
      console.error({ mensaje: "Error al verificar placa en log", error });
      return null;
    }
  };

  const iniciarPollingPlaca = (placa: string) => {
    let intentos = 0;
    const maxIntentos = 20; // 20 segundos

    pollingIntervalRef.current = setInterval(async () => {
      intentos++;

      // Verificar si la placa está cacheada en el servicio de Despiezo
      try {
        const url = `https://despiezo.solvedia.app/matricula/cached/${placa.toLowerCase()}`;
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // La placa está cacheada, actualizar el log
            await actualizarArchivoPlaca(placa, true);
            
            // Detener polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            
            console.log(`Placa ${placa} cacheada y log actualizado`);
          }
        }
      } catch (error) {
        console.error("Error en polling de placa:", error);
      }

      // Detener después de 20 intentos
      if (intentos >= maxIntentos) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    }, 1000); // Cada segundo
  };

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

  const handleSelectVersion = async (version: VehicleVersion | null, index: number, availVersion?: AvailableVersion) => {
    setShowVersionModal(false);

    const basePlate = matricula.trim().toLowerCase().split("-")[0];
    const selectedPlate = index === 0 ? basePlate : `${basePlate}-${index}`;
    
    let marca = "";
    let modelo = "";
    let year = "";

    if (version) {
      marca = version.versionName.split(" ")[0];
      modelo = version.versionName.split(" ").slice(1, 3).join(" ");
      year = version.details["Año de fabricación (desde - hasta)"];
    } else if (availVersion) {
      const nameParts = availVersion.name.split(" ");
      marca = nameParts[0];
      modelo = nameParts.slice(1, 3).join(" ");
      const yearMatch = availVersion.name.match(/\((\d{2}\.\d{4})/);
      if (yearMatch) {
        year = yearMatch[1];
      }
    }

    const searchParams = new URLSearchParams();
    if (marca) searchParams.set("marca", marca);
    if (modelo) searchParams.set("modelo", modelo);
    if (year) searchParams.set("año", year);
    searchParams.set("matricula", selectedPlate);
    
    // Forzar reset de overflow antes de navegar (el Dialog de Radix puede dejarlo en hidden)
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    
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
        const basePlate = matricula.trim().toLowerCase().split("-")[0];
        
        // 1. Verificar si la placa ya existe en el log
        const placaEnLog = await verificarPlacaEnLog(basePlate);
        
        // 2. Si existe y está procesada (cacheada), continuar normalmente
        if (placaEnLog && placaEnLog.procesed === true) {
          console.log(`Placa ${basePlate} ya está cacheada en el log`);
        } else if (!placaEnLog) {
          // 3. Si no existe en el log, crearla con procesed: false
          console.log(`Registrando placa ${basePlate} en el log con procesed: false`);
          await crearArchivoPlaca(basePlate, false);
          
          // 4. Iniciar polling para detectar cuando se cachee
          iniciarPollingPlaca(basePlate);
        } else if (placaEnLog.procesed === false) {
          // 5. Si existe pero no está procesada, reiniciar polling
          console.log(`Placa ${basePlate} existe pero no está cacheada, reiniciando polling`);
          iniciarPollingPlaca(basePlate);
        }

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

        // 6. Si la búsqueda fue exitosa y la placa está cacheada, actualizar el log
        if (result.success) {
          await actualizarArchivoPlaca(basePlate, true);
          // Detener polling si está activo
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }

        // Si tiene múltiples versiones, mostramos el modal
        const solResult = result as MatriculaResponseSolvedia;
        const hasMultiple = solResult.hasMultipleVersions || 
          ("data" in result && "processedVersions" in result.data && result.data.processedVersions.length > 1);
        
        if (hasMultiple) {
          setVersions(solResult.data.processedVersions || []);
          setAvailableVersions(solResult.data.availableVersions || []);
          setSearchResult(solResult);
          
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
        
        // Forzar reset de overflow antes de navegar
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Car className="size-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Selecciona tu versión</DialogTitle>
                <DialogDescription className="mt-0.5">
                  Matrícula: <strong>{matricula}</strong>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-start gap-2 px-1 py-2 bg-amber-50 rounded-lg border border-amber-100 mt-2">
            <span className="text-amber-500 mt-0.5">⚠</span>
            <p className="text-sm text-amber-700">
              Encontramos {availableVersions.length > 0 ? availableVersions.length : versions.length} versiones para este vehículo. Selecciona la que corresponda a tu coche.
            </p>
          </div>

          <ScrollArea className="max-h-[60vh] mt-2 pr-4">
            <div className="grid gap-3">
              {/* Si tenemos processedVersions completas, las mostramos */}
              {versions.length > 1 ? versions.map((version, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectVersion(version, version.currentVersionIndex)}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <Car className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {version.versionName}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                        {version.details?.Tipo && <span><strong>Motor:</strong> {version.details.Tipo}</span>}
                        {version.details?.["Año de fabricación (desde - hasta)"] && <span><strong>Año:</strong> {version.details["Año de fabricación (desde - hasta)"]}</span>}
                        {version.details?.["Potencia [cv]"] && <span><strong>Potencia:</strong> {version.details["Potencia [cv]"]} CV</span>}
                        {version.details?.["Tipo de combustible"] && <span><strong>Combustible:</strong> {version.details["Tipo de combustible"]}</span>}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </button>
              )) : availableVersions.map((av) => {
                // Buscar si existe una processedVersion para esta availableVersion
                const processedVersion = versions.find(v => v.currentVersionIndex === av.index);
                return (
                  <button
                    key={av.index}
                    onClick={() => handleSelectVersion(processedVersion || null, av.index, av)}
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Car className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {processedVersion ? processedVersion.versionName : av.name}
                        </h3>
                        {processedVersion ? (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            {processedVersion.details?.Tipo && <span><strong>Motor:</strong> {processedVersion.details.Tipo}</span>}
                            {processedVersion.details?.["Año de fabricación (desde - hasta)"] && <span><strong>Año:</strong> {processedVersion.details["Año de fabricación (desde - hasta)"]}</span>}
                            {processedVersion.details?.["Potencia [cv]"] && <span><strong>Potencia:</strong> {processedVersion.details["Potencia [cv]"]} CV</span>}
                            {processedVersion.details?.["Tipo de combustible"] && <span><strong>Combustible:</strong> {processedVersion.details["Tipo de combustible"]}</span>}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 mt-1">{av.name}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowVersionModal(false)}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
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
