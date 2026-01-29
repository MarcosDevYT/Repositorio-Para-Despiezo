"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Lock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Car,
  Settings,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { useMarcas } from "@/hooks/use-marcas";
import { useModelos } from "@/hooks/use-modelos";

const SECRET_KEY = "catalogosecreto";

interface CompatibilidadItem {
  id: string;
  marca: string | null;
  modelo: string | null;
  anio: string | null;
  variante: string | null;
  tipo: string | null;
  chasis: string | null;
  motor: string | null;
  atributosExtra: Record<string, any> | null;
  createdAt: string;
  oemPieza: {
    oem: string;
    name: string | null;
    site: string | null;
  };
}

interface FiltersData {
  modelos: string[];
  anios: string[];
}

export default function CompatibilidadToolsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  
  // Marcas del API externo
  const { marcas: marcasApi, loading: marcasLoading } = useMarcas();
  const { getModelosByMarca, getAniosByMarca, loading: modelosLoading } = useModelos();

  // Data state
  const [compatibilidades, setCompatibilidades] = useState<CompatibilidadItem[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FiltersData>({
    modelos: [],
    anios: [],
  });
  const [loading, setLoading] = useState(false);

  // Pagination & filters
  const [page, setPage] = useState(0);
  const [limit] = useState(50);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [marcaFilter, setMarcaFilter] = useState("");
  const [modeloFilter, setModeloFilter] = useState("");
  const [anioFilter, setAnioFilter] = useState("");

  // Modelos y años filtrados por marca seleccionada
  const modelosFiltrados = marcaFilter && marcaFilter !== "all" ? getModelosByMarca(marcaFilter) : [];
  const aniosFiltrados = marcaFilter && marcaFilter !== "all" ? getAniosByMarca(marcaFilter) : [];

  // OEM lookup
  const [oemInput, setOemInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput === SECRET_KEY) {
      setIsAuthenticated(true);
      setKeyError("");
      localStorage.setItem("tools_auth", "true");
    } else {
      setKeyError("Clave incorrecta");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("tools_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchCompatibilidades = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
      });
      if (search) params.append("search", search);
      if (marcaFilter && marcaFilter !== "all") params.append("marca", marcaFilter);
      if (modeloFilter && modeloFilter !== "all") params.append("modelo", modeloFilter);
      if (anioFilter && anioFilter !== "all") params.append("anio", anioFilter);

      const res = await fetch(`/api/compatibilidades-oem?${params}`);
      const data = await res.json();

      if (data.success) {
        setCompatibilidades(data.compatibilidades);
        setTotal(data.total);
        setFilters(data.filters);
      } else {
        toast.error("Error al cargar datos");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, marcaFilter, modeloFilter, anioFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompatibilidades();
    }
  }, [isAuthenticated, fetchCompatibilidades]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleOemLookup = async () => {
    if (!oemInput.trim()) {
      toast.error("Ingresa un número OEM");
      return;
    }

    setLookupLoading(true);
    try {
      // Consultar API externa
      const externalRes = await fetch(
        `https://despiezo.solvedia.app/fastebay/${oemInput.trim()}`
      );
      const externalData = await externalRes.json();

      if (!externalData.success) {
        toast.error("No se encontraron datos para este OEM");
        setLookupLoading(false);
        return;
      }

      // Enviar datos a nuestro endpoint para guardar
      const saveRes = await fetch("/api/compatibilidades-oem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(externalData),
      });

      const saveData = await saveRes.json();

      if (saveData.success) {
        toast.success(
          `OEM ${oemInput} guardado con ${
            saveData.results?.[0]?.compatibilidadesCount || 0
          } compatibilidades`
        );
        setOemInput("");
        fetchCompatibilidades();
      } else {
        toast.error("Error al guardar los datos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al consultar el OEM");
    } finally {
      setLookupLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setMarcaFilter("");
    setModeloFilter("");
    setAnioFilter("");
    setPage(0);
  };

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Panel de Herramientas</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Ingresa la clave de acceso para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleKeySubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Clave de acceso"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="text-center text-lg"
              />
              {keyError && (
                <p className="text-red-500 text-sm text-center">{keyError}</p>
              )}
              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              Catálogo de Compatibilidades OEM
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona y consulta compatibilidades de piezas por número OEM
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("tools_auth");
              setIsAuthenticated(false);
            }}
          >
            Cerrar sesión
          </Button>
        </div>

        {/* OEM Lookup Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Consultar y Registrar OEM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Ingresa número OEM (ej: 66321D3000)"
                value={oemInput}
                onChange={(e) => setOemInput(e.target.value.toUpperCase())}
                className="flex-1 font-mono"
                onKeyDown={(e) => e.key === "Enter" && handleOemLookup()}
              />
              <Button
                onClick={handleOemLookup}
                disabled={lookupLoading}
                className="min-w-[180px]"
              >
                {lookupLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Buscar y Guardar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Consulta el API externo y guarda automáticamente las
              compatibilidades encontradas
            </p>
          </CardContent>
        </Card>

        {/* Filters & Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por OEM o nombre..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Buscar</Button>
              </form>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={marcaFilter} onValueChange={setMarcaFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {marcasLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      marcasApi.map((m) => (
                        <SelectItem key={m.id} value={m.marca}>
                          {m.marca}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Select 
                  value={modeloFilter} 
                  onValueChange={(v) => {
                    const modeloLimpio = v === "all" ? "all" : v.replace(/\s*\([^)]*\)\s*$/, "").trim();
                    setModeloFilter(modeloLimpio);
                  }}
                  disabled={!marcaFilter || marcaFilter === "all" || modelosLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={modelosLoading ? "Cargando..." : "Modelo"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">Todos</SelectItem>
                    {modelosFiltrados.map((m) => (
                      <SelectItem key={m.id} value={m.modelo}>
                        {m.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={anioFilter} 
                  onValueChange={setAnioFilter}
                  disabled={!marcaFilter || marcaFilter === "all" || aniosFiltrados.length === 0}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">Todos</SelectItem>
                    {aniosFiltrados.map((a) => (
                      <SelectItem key={a} value={a.toString()}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="ghost" onClick={clearFilters}>
                  Limpiar
                </Button>

                <Button variant="outline" onClick={fetchCompatibilidades}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Registro de Compatibilidades ({total})
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Página {page + 1} de {totalPages || 1}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : compatibilidades.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay compatibilidades registradas</p>
                <p className="text-sm">
                  Usa el campo de arriba para consultar y registrar OEMs
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">OEM</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Año</TableHead>
                        <TableHead>Carrocería</TableHead>
                        <TableHead>Motor</TableHead>
                        <TableHead>Variante</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compatibilidades.map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-mono font-bold text-primary">
                            {comp.oemPieza?.oem || "-"}
                          </TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={comp.oemPieza?.name || ""}
                          >
                            {comp.oemPieza?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{comp.marca || "-"}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {comp.modelo || "-"}
                          </TableCell>
                          <TableCell>{comp.anio || "-"}</TableCell>
                          <TableCell>{comp.tipo || "-"}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {comp.motor || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {comp.variante || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {page * limit + 1} -{" "}
                    {Math.min((page + 1) * limit, total)} de {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
