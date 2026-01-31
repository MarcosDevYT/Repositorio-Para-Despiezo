"use client";

import { useState, useEffect, useMemo } from "react";

export interface Modelo {
  id: number;
  modelo: string;
}

export interface MarcaConModelos {
  id: string;
  marca: string;
  modelos: Modelo[];
}

interface UseModelosReturn {
  data: MarcaConModelos[];
  loading: boolean;
  error: string | null;
  getModelosByMarca: (marca: string) => Modelo[];
  getAniosByModelo: (marca: string, modeloId: number) => number[];
  getAniosByMarca: (marca: string) => number[];
}

/**
 * Extrae el rango de años de un string de modelo
 * Formato: "Modelo (MM.YYYY - MM.YYYY)" o "Modelo (MM.YYYY - ...)"
 */
function extractYearRange(modeloStr: string): { start: number; end: number } | null {
  // Buscar patrón (MM.YYYY - MM.YYYY) o (MM.YYYY - ...)
  const match = modeloStr.match(/\((\d{2})\.(\d{4})\s*-\s*(?:(\d{2})\.(\d{4})|\.\.\.)\)/);
  
  if (!match) return null;
  
  const startYear = parseInt(match[2], 10);
  const endYear = match[4] ? parseInt(match[4], 10) : new Date().getFullYear();
  
  return { start: startYear, end: endYear };
}

/**
 * Genera un array de años desde start hasta end
 */
function generateYearArray(start: number, end: number): number[] {
  const years: number[] = [];
  for (let year = start; year <= end; year++) {
    years.push(year);
  }
  return years;
}

export function useModelos(): UseModelosReturn {
  const [data, setData] = useState<MarcaConModelos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchModelos() {
      try {
        // 1. Intentar obtener de LocalStorage
        const cached = localStorage.getItem("modelos_cache");
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > 1000 * 60 * 60 * 24; // 24 horas
          
          if (!isExpired) {
            setData(data);
            setLoading(false);
            return;
          }
        }

        const res = await fetch("/api/modelos");
        const json = await res.json();

        if (!isMounted) return;

        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
          
          // 2. Guardar en LocalStorage
          localStorage.setItem("modelos_cache", JSON.stringify({
            data: json.data,
            timestamp: Date.now()
          }));
          
          setError(null);
        } else {
          setError(json.error || "Error al obtener modelos");
        }
      } catch (err) {
        if (isMounted) {
          setError("Error de conexión");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchModelos();

    return () => {
      isMounted = false;
    };
  }, []);

  const getModelosByMarca = useMemo(() => {
    return (marca: string): Modelo[] => {
      const marcaData = data.find(
        (m) => m.marca.toLowerCase() === marca.toLowerCase()
      );
      return marcaData?.modelos || [];
    };
  }, [data]);

  const getAniosByModelo = useMemo(() => {
    return (marca: string, modeloId: number): number[] => {
      const modelos = getModelosByMarca(marca);
      const modelo = modelos.find((m) => m.id === modeloId);
      
      if (!modelo) return [];
      
      const range = extractYearRange(modelo.modelo);
      if (!range) return [];
      
      return generateYearArray(range.start, range.end).sort((a, b) => b - a);
    };
  }, [getModelosByMarca]);

  const getAniosByMarca = useMemo(() => {
    return (marca: string): number[] => {
      const modelos = getModelosByMarca(marca);
      const allYears = new Set<number>();
      
      modelos.forEach((modelo) => {
        const range = extractYearRange(modelo.modelo);
        if (range) {
          for (let year = range.start; year <= range.end; year++) {
            allYears.add(year);
          }
        }
      });
      
      return Array.from(allYears).sort((a, b) => b - a);
    };
  }, [getModelosByMarca]);

  return {
    data,
    loading,
    error,
    getModelosByMarca,
    getAniosByModelo,
    getAniosByMarca,
  };
}
