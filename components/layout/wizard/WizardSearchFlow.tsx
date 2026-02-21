"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MainContainer } from "@/components/layout/MainContainer";
import {
  ArrowLeft,
  Search,
  Hash,
  Car,
  FileText,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarcas } from "@/hooks/use-marcas";
import { useModelos } from "@/hooks/use-modelos";
import { searchByMatricula } from "@/actions/matricula-actions";
import type { MatriculaResponseSolvedia } from "@/actions/matricula-actions";

type SearchMode = "choice" | "oem" | "matricula" | "marca";

interface Props {
  onBack: () => void;
}

export const WizardSearchFlow = ({ onBack }: Props) => {
  const [mode, setMode] = useState<SearchMode>("choice");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // OEM search
  const [oemQuery, setOemQuery] = useState("");

  // Matrícula search
  const [matriculaQuery, setMatriculaQuery] = useState("");
  const [vehicleVersions, setVehicleVersions] = useState<any[]>([]);
  const [showVersions, setShowVersions] = useState(false);

  // Marca/Modelo search
  const { marcas, loading: marcasLoading } = useMarcas();
  const { getModelosByMarca, getAniosByMarca, loading: modelosLoading } = useModelos();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const modelosFiltrados = selectedBrand ? getModelosByMarca(selectedBrand) : [];
  const aniosFiltrados = selectedBrand ? getAniosByMarca(selectedBrand) : [];

  // --- Handlers ---
  const handleOemSearch = () => {
    if (!oemQuery.trim()) return;
    router.push(`/productos?oem=${encodeURIComponent(oemQuery.trim())}`);
  };

  const handleMatriculaSearch = () => {
    if (!matriculaQuery.trim()) return;
    startTransition(async () => {
      const result = await searchByMatricula(matriculaQuery.trim());
      if ("error" in result) {
        router.push(`/productos?query=${encodeURIComponent(matriculaQuery.trim())}`);
        return;
      }

      // Check if it has multiple versions
      if ("hasMultipleVersions" in result && result.hasMultipleVersions) {
        const solData = result as MatriculaResponseSolvedia;
        setVehicleVersions(solData.data.processedVersions);
        setShowVersions(true);
      } else {
        // Single version - redirect to search with vehicle data
        const solData = result as MatriculaResponseSolvedia;
        const version = solData.data.processedVersions[0];
        if (version) {
          const title = version.title || "";
          router.push(`/productos?query=${encodeURIComponent(title)}`);
        } else {
          router.push(`/productos?query=${encodeURIComponent(matriculaQuery.trim())}`);
        }
      }
    });
  };

  const handleVersionSelect = (version: any) => {
    const title = version.title || version.versionName || "";
    router.push(`/productos?query=${encodeURIComponent(title)}`);
  };

  const handleMarcaModeloSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set("marca", selectedBrand);
    if (selectedModel) params.set("modelo", selectedModel);
    if (selectedYear) params.set("año", selectedYear);
    if (selectedBrand) params.set("query", [selectedBrand, selectedModel, selectedYear].filter(Boolean).join(" "));
    router.push(`/productos?${params.toString()}`);
  };

  // --- Choice screen ---
  if (mode === "choice") {
    return (
      <MainContainer className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              ¿Cómo quieres buscar?
            </h2>
            <p className="text-gray-500">
              Elige la forma más conveniente para encontrar tu pieza.
            </p>
          </div>

          <div className="space-y-3">
            {/* OEM */}
            <button
              onClick={() => setMode("oem")}
              className="group w-full flex items-center gap-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-400 p-5 text-left transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="bg-blue-50 group-hover:bg-blue-100 rounded-lg p-2.5 transition-colors">
                <Hash className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Por número OEM</h3>
                <p className="text-sm text-gray-500">Busca directamente con la referencia de la pieza</p>
              </div>
              <ChevronRight className="size-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </button>

            {/* Matrícula */}
            <button
              onClick={() => setMode("matricula")}
              className="group w-full flex items-center gap-4 bg-white rounded-xl border-2 border-gray-100 hover:border-purple-400 p-5 text-left transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="bg-purple-50 group-hover:bg-purple-100 rounded-lg p-2.5 transition-colors">
                <FileText className="size-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Por matrícula</h3>
                <p className="text-sm text-gray-500">Identifica tu vehículo y encuentra piezas compatibles</p>
              </div>
              <ChevronRight className="size-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
            </button>

            {/* Marca/Modelo */}
            <button
              onClick={() => setMode("marca")}
              className="group w-full flex items-center gap-4 bg-white rounded-xl border-2 border-gray-100 hover:border-emerald-400 p-5 text-left transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="bg-emerald-50 group-hover:bg-emerald-100 rounded-lg p-2.5 transition-colors">
                <Car className="size-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Por marca, modelo y año</h3>
                <p className="text-sm text-gray-500">Selecciona las características de tu vehículo</p>
              </div>
              <ChevronRight className="size-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </button>
          </div>
        </div>
      </MainContainer>
    );
  }

  // --- OEM search ---
  if (mode === "oem") {
    return (
      <MainContainer className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => setMode("choice")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex bg-blue-50 rounded-full p-3 mb-4">
              <Hash className="size-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buscar por OEM</h2>
            <p className="text-gray-500 text-sm">Ingresa el número de referencia de la pieza</p>
          </div>

          <div className="space-y-4">
            <Input
              value={oemQuery}
              onChange={(e) => setOemQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOemSearch()}
              placeholder="Ej: 1K0615301AA"
              className="h-12 text-center text-lg font-mono"
              autoFocus
            />
            <Button
              onClick={handleOemSearch}
              disabled={!oemQuery.trim()}
              className="w-full h-12 text-base"
            >
              <Search className="size-4 mr-2" />
              Buscar pieza
            </Button>
          </div>
        </div>
      </MainContainer>
    );
  }

  // --- Matrícula search ---
  if (mode === "matricula") {
    return (
      <MainContainer className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => { setMode("choice"); setShowVersions(false); setVehicleVersions([]); }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex bg-purple-50 rounded-full p-3 mb-4">
              <FileText className="size-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buscar por matrícula</h2>
            <p className="text-gray-500 text-sm">Ingresa la matrícula de tu vehículo</p>
          </div>

          {!showVersions ? (
            <div className="space-y-4">
              <Input
                value={matriculaQuery}
                onChange={(e) => setMatriculaQuery(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleMatriculaSearch()}
                placeholder="Ej: 1234ABC"
                className="h-12 text-center text-lg font-mono uppercase tracking-widest"
                autoFocus
              />
              <Button
                onClick={handleMatriculaSearch}
                disabled={!matriculaQuery.trim() || isPending}
                className="w-full h-12 text-base"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Buscando vehículo...
                  </>
                ) : (
                  <>
                    <Search className="size-4 mr-2" />
                    Identificar vehículo
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center mb-4">
                Se encontraron <span className="font-semibold">{vehicleVersions.length}</span> variaciones. Selecciona la tuya:
              </p>
              {vehicleVersions.map((version: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleVersionSelect(version)}
                  className="w-full bg-white rounded-xl border-2 border-gray-100 hover:border-purple-400 p-4 text-left transition-all hover:shadow-md cursor-pointer"
                >
                  <p className="font-semibold text-gray-900 text-sm">{version.title || version.versionName}</p>
                  {version.details && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {version.details["Tipo de combustible"] && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {version.details["Tipo de combustible"]}
                        </span>
                      )}
                      {version.details["Potencia [cv]"] && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {version.details["Potencia [cv]"]} cv
                        </span>
                      )}
                      {version.details["Año de fabricación (desde - hasta)"] && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {version.details["Año de fabricación (desde - hasta)"]}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </MainContainer>
    );
  }

  // --- Marca/Modelo/Año search ---
  if (mode === "marca") {
    return (
      <MainContainer className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => setMode("choice")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex bg-emerald-50 rounded-full p-3 mb-4">
              <Car className="size-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buscar por vehículo</h2>
            <p className="text-gray-500 text-sm">Selecciona marca, modelo y año</p>
          </div>

          <div className="space-y-4">
            {/* Marca */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Marca</label>
              <Select
                onValueChange={(v) => {
                  setSelectedBrand(v);
                  setSelectedModel("");
                  setSelectedYear("");
                }}
                value={selectedBrand}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={marcasLoading ? "Cargando marcas..." : "Selecciona una marca"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {marcas.map((m) => (
                    <SelectItem key={m.id} value={m.marca}>
                      {m.marca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modelo */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Modelo</label>
              <Select
                onValueChange={(v) => {
                  const modeloLimpio = v.replace(/\s*\([^)]*\)\s*$/, "").trim();
                  setSelectedModel(modeloLimpio);
                }}
                value={modelosFiltrados.find(m =>
                  m.modelo.replace(/\s*\([^)]*\)\s*$/, "").trim() === selectedModel
                )?.modelo || ""}
                disabled={!selectedBrand || modelosLoading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={modelosLoading ? "Cargando..." : "Selecciona un modelo"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {modelosFiltrados.map((m) => (
                    <SelectItem key={m.id} value={m.modelo}>
                      {m.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Año */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Año</label>
              <Select
                onValueChange={setSelectedYear}
                value={selectedYear}
                disabled={!selectedBrand || aniosFiltrados.length === 0}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona un año" />
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

            <Button
              onClick={handleMarcaModeloSearch}
              disabled={!selectedBrand}
              className="w-full h-12 text-base mt-2"
            >
              <Search className="size-4 mr-2" />
              Buscar piezas
            </Button>
          </div>
        </div>
      </MainContainer>
    );
  }

  return null;
};
