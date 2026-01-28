"use client";

import { useState, useEffect } from "react";

export interface MarcaAutodoc {
  id: string;
  marca: string;
}

interface MarcasResponse {
  success: boolean;
  message: string;
  data: MarcaAutodoc[];
}

const MARCAS_ENDPOINT = "/api/marcas";

export function useMarcas() {
  const [marcas, setMarcas] = useState<MarcaAutodoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setLoading(true);
        const res = await fetch(MARCAS_ENDPOINT);
        const data: MarcasResponse = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Ordenar alfabéticamente
          const sorted = data.data.sort((a, b) =>
            a.marca.localeCompare(b.marca)
          );
          setMarcas(sorted);
        } else {
          setError("Error al obtener marcas");
        }
      } catch (err) {
        console.error("Error fetching marcas:", err);
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  return { marcas, loading, error };
}

// Función para obtener marcas sin hook (para server components o uso puntual)
export async function fetchMarcas(): Promise<MarcaAutodoc[]> {
  try {
    const res = await fetch("/api/marcas", { next: { revalidate: 3600 } });
    const data: MarcasResponse = await res.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error("Error fetching marcas:", err);
    return [];
  }
}
