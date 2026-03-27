"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  Package,
  Database,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface TrackingItem {
  id: string;
  oem: string;
  status: boolean;
  compatibilityCount: number;
  productName: string;
  productStatus: string;
  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function OemTrackingTab() {
  const [trackingData, setTrackingData] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [limit] = useState(50);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const res = await fetch(`/api/oem-tracking?${params}`);
      const data = await res.json();

      if (data.success) {
        setTrackingData(data.data);
      } else {
        toast.error("Error al cargar datos de tracking");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/oem-tracking/sync", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        const skippedMsg = data.skipped > 0 ? `, ${data.skipped} omitidos` : "";
        toast.success(
          `Sincronización completada: ${data.created} creados, ${data.updated} actualizados${skippedMsg} de ${data.total} productos`
        );
        fetchTrackingData();
      } else {
        toast.error("Error al sincronizar productos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setSyncing(false);
    }
  };

  const handleExportPending = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/oem-tracking/pending");
      const data = await res.json();

      if (data.success) {
        // Crear archivo JSON para descargar
        const jsonData = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `oems-pendientes-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(`${data.total} OEMs pendientes exportados`);
      } else {
        toast.error("Error al exportar OEMs pendientes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(trackingData.length / limit);
  const paginatedData = trackingData.slice(page * limit, (page + 1) * limit);

  const pendingCount = trackingData.filter((item) => !item.status).length;
  const completedCount = trackingData.filter((item) => item.status).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{trackingData.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sin Compatibilidades</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Con Compatibilidades</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="false">Sin compatibilidades</SelectItem>
                  <SelectItem value="true">Con compatibilidades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                onClick={handleSyncAll}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Sincronizar Productos
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleExportPending}
                disabled={exporting || pendingCount === 0}
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Pendientes ({pendingCount})
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={fetchTrackingData} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <strong>Sincronizar:</strong> Registra todos los productos con OEM. 
            <strong className="ml-2">Exportar Pendientes:</strong> Descarga JSON con OEMs sin compatibilidades para procesarlos externamente.
          </p>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Tracking de Productos ({trackingData.length})
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
          ) : trackingData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos en tracking</p>
              <p className="text-sm">
                Los productos se registran automáticamente cuando se visitan
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Producto</TableHead>
                      <TableHead>OEM</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Compatibilidades</TableHead>
                      <TableHead>Estado Producto</TableHead>
                      <TableHead>Última Verificación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-[250px]">
                          <div className="truncate font-medium" title={item.productName}>
                            {item.productName}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-primary">
                          {item.oem}
                        </TableCell>
                        <TableCell>
                          {item.status ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              <XCircle className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.compatibilityCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.productStatus}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(item.lastCheckedAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Link href={`/productos/${item.id}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Ver Producto
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {page * limit + 1} -{" "}
                    {Math.min((page + 1) * limit, trackingData.length)} de {trackingData.length}
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
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
