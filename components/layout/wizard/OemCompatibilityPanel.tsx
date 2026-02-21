"use client";

import { useState, useMemo } from "react";
import {
  Car,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CompatAutoFillData {
  name?: string;
  price?: string;
  brand?: string;
  model?: string;
  year?: string;
}

interface Props {
  data: any;
  oem: string;
  onApplyData?: (data: CompatAutoFillData) => void;
}

export const OemCompatibilityPanel = ({ data, oem, onApplyData }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState(false);

  // Parse data synchronously
  const { compatibilities, pieceInfo } = useMemo(() => {
    if (!data) return { compatibilities: [], pieceInfo: null };

    let compats: any[] = [];
    let info: any = null;

    if (data.data && Array.isArray(data.data)) {
      const item = data.data[0];
      info = item;
      if (item?.compatibilidad && Array.isArray(item.compatibilidad)) {
        compats = item.compatibilidad;
      }
    } else if (data.compatibilidad && Array.isArray(data.compatibilidad)) {
      compats = data.compatibilidad;
    }

    return { compatibilities: compats, pieceInfo: info };
  }, [data]);

  // Extract auto-fill data from compatibility results
  const extractedData = useMemo<CompatAutoFillData | null>(() => {
    if (!pieceInfo && compatibilities.length === 0) return null;

    const result: CompatAutoFillData = {};

    // Extract name from pieceInfo
    if (pieceInfo?.name) {
      result.name = pieceInfo.name;
    }

    // Extract price — prefer EUR
    if (pieceInfo?.priceEUR) {
      const cleaned = String(pieceInfo.priceEUR).replace(/[^\d.,]/g, "").replace(",", ".");
      if (cleaned) result.price = cleaned;
    } else if (pieceInfo?.price) {
      const cleaned = String(pieceInfo.price).replace(/[^\d.,]/g, "").replace(",", ".");
      if (cleaned) result.price = cleaned;
    }

    // Extract brand, model, year from first compatibility entry
    if (compatibilities.length > 0) {
      const first = compatibilities[0];
      if (first.marca) result.brand = first.marca;
      if (first.modelo) {
        // Clean model: remove parenthetical suffixes like "(BF)"
        result.model = first.modelo.replace(/\s*\([^)]*\)\s*$/, "").trim();
      }
      // Parse year from formats like "2019/06-2025/12" → "2019"
      const yearStr = first.año || first.anio || "";
      if (yearStr) {
        const yearMatch = yearStr.match(/(\d{4})/);
        if (yearMatch) result.year = yearMatch[1];
      }
    }

    // Only return if we have at least name or brand
    if (result.name || result.brand) return result;
    return null;
  }, [pieceInfo, compatibilities]);

  const handleApply = () => {
    if (extractedData && onApplyData) {
      onApplyData(extractedData);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  // Show loader when data is null (parent is still fetching)
  if (!data) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
            <div className="relative bg-blue-100 rounded-full p-3">
              <Car className="size-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-800">
              Buscando compatibilidades...
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Consultando datos para OEM: <span className="font-mono font-bold">{oem}</span>
            </p>
          </div>
          <div className="flex gap-1">
            <div className="size-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="size-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="size-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (compatibilities.length === 0 && !pieceInfo) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <Info className="size-4" />
          <p className="text-sm">No se encontraron compatibilidades para este OEM.</p>
        </div>
      </div>
    );
  }

  const visibleCompats = expanded ? compatibilities : compatibilities.slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-green-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-600" />
          <span className="text-sm font-semibold text-green-800">
            {compatibilities.length} compatibilidad{compatibilities.length !== 1 ? "es" : ""} encontrada{compatibilities.length !== 1 ? "s" : ""}
          </span>
        </div>
        {/* Link to test compatibility */}
        <a
          href={`https://despiezo.solvedia.app/fastebay/${encodeURIComponent(oem)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Ver detalles completos
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Piece info */}
      {pieceInfo && pieceInfo.name && (
        <div className="px-4 py-2 bg-white/50 border-b border-green-100">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Pieza:</span> {pieceInfo.name}
          </p>
          {pieceInfo.price && (
            <p className="text-xs text-gray-500">
              Precio referencia: {pieceInfo.price}
              {pieceInfo.priceEUR && ` (${pieceInfo.priceEUR})`}
            </p>
          )}
        </div>
      )}

      {/* Auto-fill button — only when extractable data exists */}
      {extractedData && onApplyData && (
        <div className="px-4 py-3 border-b border-green-100 bg-amber-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-800 mb-1">
                Datos extraídos del artículo:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.name && (
                  <span className="inline-flex items-center text-[11px] bg-white/80 text-gray-700 px-2 py-0.5 rounded-md border border-amber-200">
                    <span className="font-medium text-amber-700 mr-1">Título:</span>
                    <span className="truncate max-w-[200px]">{extractedData.name}</span>
                  </span>
                )}
                {extractedData.brand && (
                  <span className="inline-flex items-center text-[11px] bg-white/80 text-gray-700 px-2 py-0.5 rounded-md border border-amber-200">
                    <span className="font-medium text-amber-700 mr-1">Marca:</span>{extractedData.brand}
                  </span>
                )}
                {extractedData.model && (
                  <span className="inline-flex items-center text-[11px] bg-white/80 text-gray-700 px-2 py-0.5 rounded-md border border-amber-200">
                    <span className="font-medium text-amber-700 mr-1">Modelo:</span>{extractedData.model}
                  </span>
                )}
                {extractedData.year && (
                  <span className="inline-flex items-center text-[11px] bg-white/80 text-gray-700 px-2 py-0.5 rounded-md border border-amber-200">
                    <span className="font-medium text-amber-700 mr-1">Año:</span>{extractedData.year}
                  </span>
                )}
                {extractedData.price && (
                  <span className="inline-flex items-center text-[11px] bg-white/80 text-gray-700 px-2 py-0.5 rounded-md border border-amber-200">
                    <span className="font-medium text-amber-700 mr-1">Precio:</span>{extractedData.price}€
                  </span>
                )}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              disabled={applied}
              className={`shrink-0 text-xs h-8 px-3 transition-all ${
                applied
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="size-3.5 mr-1" />
                  Aplicado
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 mr-1" />
                  Usar estos datos
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Compatibility list */}
      {compatibilities.length > 0 && (
        <div className="px-4 py-3">
          <div className="space-y-1.5">
            {visibleCompats.map((compat: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs bg-white/60 rounded-lg px-3 py-2"
              >
                <Car className="size-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {[compat.marca, compat.modelo, compat.año || compat.anio]
                    .filter(Boolean)
                    .join(" ")}
                </span>
                {compat.variante && (
                  <span className="text-gray-400 truncate">
                    — {compat.variante}
                  </span>
                )}
                {compat.motor && (
                  <span className="text-gray-400 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {compat.motor}
                  </span>
                )}
              </div>
            ))}
          </div>

          {compatibilities.length > 5 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex items-center gap-1 text-xs text-green-700 hover:text-green-900 font-medium mx-auto transition-colors"
            >
              {expanded ? (
                <>
                  Ver menos <ChevronUp className="size-3" />
                </>
              ) : (
                <>
                  Ver {compatibilities.length - 5} más <ChevronDown className="size-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
