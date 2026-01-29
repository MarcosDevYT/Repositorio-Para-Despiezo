"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { searchHistoryCreate } from "@/actions/user-actions";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchIndex = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("query") || "";

  const [query, setQuery] = useState(queryParams);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [oemSuggestions, setOemSuggestions] = useState<any[]>([]);
  const [productsByOem, setProductsByOem] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 👉 Guardamos el último query que ya buscamos
  const lastFetchedQuery = useRef<string>("");

  // 🔍 Fetch sugerencias y populares
  const fetchSuggestions = async (q: string) => {
    const trimmedQuery = q.trim();
    if (trimmedQuery === lastFetchedQuery.current) {
      // Solo mostrar dropdown si ya hay datos cargados
      setShowSuggestions(true);
      return;
    }

    lastFetchedQuery.current = trimmedQuery;

    setIsLoading(true);

    try {
      const url = new URL("/api/search/suggest", window.location.origin);
      url.searchParams.append("q", trimmedQuery);
      if (userId) url.searchParams.append("userId", userId); // 👈 pasamos userId si existe

      const res = await fetch(url.toString());
      const data = await res.json();

      setSuggestions(data.suggestions || []);
      setOemSuggestions(data.oemSuggestions || []);
      setProductsByOem(data.productsByOem || []);
      setPopular(data.popular || []);
      setHistory(data.history || []); // 👈 guardamos historial
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setOemSuggestions([]);
      setProductsByOem([]);
      setPopular([]);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecutar búsqueda
  const handleSearch = async (s: any | string) => {
    setIsSearching(true);

    let name: string | undefined;
    let brand: string | undefined;
    let model: string | undefined;
    let oemNumber: string | undefined;

    if (typeof s === "string") {
      name = s.trim();
    } else {
      name = s.name;
      brand = s.brand;
      model = s.model;
      oemNumber = s.oemNumber;
    }

    if (!name) {
      setIsSearching(false);
      return;
    }

    const params = new URLSearchParams();
    params.append("query", name);
    if (brand) params.append("marca", brand);
    if (model) params.append("modelo", model);
    if (oemNumber) params.append("oem", oemNumber);

    // Guardar historial
    const formData = new FormData();
    formData.append("query", name);
    await searchHistoryCreate(formData);

    // Guardar log global
    await fetch("/api/search/suggest/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: name,
      }),
    });

    router.push(`/productos?${params.toString()}`);
    setIsSearching(false);
    setShowSuggestions(false);
  };

  // Enter en input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query);
    }
  };

  // Input focus
  const handleFocus = () => {
    // Siempre hacemos fetch aunque query esté vacío
    fetchSuggestions(query);
  };

  // Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      // Si el input está vacío, limpiamos sugerencias
      setSuggestions([]);
      // Igualmente hacemos fetch para traer historial y populares
      fetchSuggestions(value);
    } else {
      // Si hay texto, buscamos sugerencias
      fetchSuggestions(value);
    }
  };

  useEffect(() => {
    // ⚡ Fetch inicial
    const initialQuery = query.trim();

    const fetchInitial = async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(initialQuery)}`
        );
        const data = await res.json();

        setSuggestions(data.suggestions || []);
        setOemSuggestions(data.oemSuggestions || []);
        setProductsByOem(data.productsByOem || []);
        setPopular(data.popular || []);

        lastFetchedQuery.current = initialQuery;
      } catch {
        setSuggestions([]);
        setOemSuggestions([]);
        setProductsByOem([]);
        setPopular([]);
      }
    };

    fetchInitial();
  }, []);

  // Click fuera → cerrar sugerencias
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center w-full relative z-10">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Buscar partes de vehículos..."
          className="w-full border-2 rounded-full h-12 px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          autoComplete="off"
        />

        <Button
          type="button"
          disabled={!query.trim() || isSearching}
          onClick={() => handleSearch(query)}
          className="absolute right-1 h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
        >
          {isSearching ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Search className="text-white" />
          )}
        </Button>
      </div>

      {/* Dropdown sugerencias */}
      {showSuggestions && (
        <div className="absolute z-0 top-0 shadow-lg max-h-80 overflow-y-auto w-full bg-white mt-1 pt-12 border-2 border-input rounded-xl">
          {isLoading ? (
            <div className="p-2 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ) : (
            <div className="p-2">
              {history.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 mb-1 px-1">
                    Últimas búsquedas
                  </p>
                  <ul>
                    {history.map((h) => (
                      <li
                        key={h.id}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded text-gray-700"
                        onClick={() => handleSearch(h.query)}
                      >
                        {h.query}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Sección OEM */}
              {oemSuggestions.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 mt-3 mb-1 px-1">
                    Referencias OEM
                  </p>
                  <ul>
                    {oemSuggestions.map((oem) => (
                      <li
                        key={oem.id}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center justify-between"
                        onClick={() => handleSearch(oem.oem)}
                      >
                        <div>
                          <span className="font-mono font-semibold text-blue-600">
                            {oem.oem}
                          </span>
                          {oem.name && (
                            <span className="text-gray-600 ml-2 text-sm">
                              — {oem.name}
                            </span>
                          )}
                        </div>
                        {oem.compatCount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {oem.compatCount} compat.
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Sección productos por OEM */}
              {productsByOem.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 mt-3 mb-1 px-1">
                    Productos con este OEM
                  </p>
                  <ul>
                    {productsByOem.map((p) => (
                      <li
                        key={p.id}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-3"
                        onClick={() => {
                          setShowSuggestions(false);
                          window.location.href = `/productos/${p.id}`;
                        }}
                      >
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">
                            <span className="font-mono text-blue-600">{p.oemNumber}</span>
                            {p.brand && ` • ${p.brand}`}
                            {p.model && ` ${p.model}`}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          €{p.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Sección sugerencias */}
              {suggestions.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 mb-1 px-1">Sugerencias</p>
                  <ul>
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                        onClick={() => handleSearch(s)}
                      >
                        {s.type === "reference"
                          ? s.oemNumber
                          : `${s.name}${s.brand ? ` — ${s.brand}` : ""}${s.model ? ` ${s.model}` : ""}`}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Sección populares */}
              {popular.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 mt-3 mb-1 px-1">
                    Populares
                  </p>
                  <ul>
                    {popular.map((p, i) => (
                      <li
                        key={`popular-${i}`}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded text-blue-600"
                        onClick={() => handleSearch(p.query)}
                      >
                        {p.query}{" "}
                        <span className="text-xs text-gray-400">
                          (buscado {p.clicks} veces)
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {suggestions.length === 0 && oemSuggestions.length === 0 && productsByOem.length === 0 && popular.length === 0 && (
                <p className="p-2 text-gray-500 text-sm italic">
                  No se encontraron resultados
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
