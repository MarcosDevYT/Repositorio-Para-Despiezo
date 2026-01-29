"use client";

import { useState, Fragment } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Car,
  Settings,
} from "lucide-react";
import { OemCompatibilidad } from "@prisma/client";

interface ProductCompatibilitiesProps {
  compatibilidades: OemCompatibilidad[];
}

const ITEMS_PER_PAGE = 15;

export function ProductCompatibilities({
  compatibilidades,
}: ProductCompatibilitiesProps) {
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  if (!compatibilidades || compatibilidades.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(compatibilidades.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = compatibilidades.slice(startIndex, endIndex);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Compatibilidades ({compatibilidades.length})
          </CardTitle>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Página {page + 1} de {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevPage}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead className="hidden sm:table-cell">Año</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((comp) => {
                const isExpanded = expandedRows.has(comp.id);
                return (
                  <Fragment key={comp.id}>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(comp.id)}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {comp.marca} {comp.modelo}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {comp.anio}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {comp.anio}
                      </TableCell>
                      <TableCell className="text-center">
                        {comp.tipo && (
                          <Badge variant="outline" className="text-xs">
                            {comp.tipo}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={4} className="p-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            {comp.variante && (
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Variante
                                </span>
                                <span className="font-medium">{comp.variante}</span>
                              </div>
                            )}
                            {comp.chasis && (
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Chasis
                                </span>
                                <span className="font-medium">{comp.chasis}</span>
                              </div>
                            )}
                            {comp.motor && (
                              <div>
                                <span className="text-muted-foreground block text-xs flex items-center gap-1">
                                  <Settings className="h-3 w-3" /> Motor
                                </span>
                                <span className="font-medium">{comp.motor}</span>
                              </div>
                            )}
                            {comp.atributosExtra && Object.keys(comp.atributosExtra as object).length > 0 && (
                              <div className="col-span-2 sm:col-span-4">
                                <span className="text-muted-foreground block text-xs mb-1">
                                  Atributos adicionales
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(comp.atributosExtra as object).map(([key, value]) => (
                                    <Badge key={key} variant="secondary" className="text-xs">
                                      {key}: {String(value)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              Mostrando {startIndex + 1}-{Math.min(endIndex, compatibilidades.length)} de{" "}
              {compatibilidades.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
