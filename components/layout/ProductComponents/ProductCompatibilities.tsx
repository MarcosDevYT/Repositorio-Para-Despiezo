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

  if (!compatibilidades || compatibilidades.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(compatibilidades.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = compatibilidades.slice(startIndex, endIndex);

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
        <div className="hidden md:block rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Marca / Modelo</TableHead>
                <TableHead className="font-bold text-center">Año</TableHead>
                <TableHead className="font-bold">Motor / Chasis</TableHead>
                <TableHead className="font-bold">Tipo / Variante</TableHead>
                <TableHead className="font-bold">Atributos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((comp) => (
                <TableRow key={comp.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-bold text-foreground">
                      {comp.marca} {comp.modelo}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {comp.anio}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      {comp.motor && (
                        <div className="flex items-center gap-1 text-xs">
                          <Settings className="h-3 w-3 text-primary" />
                          <span className="font-medium text-muted-foreground">Motor:</span>
                          <span>{comp.motor}</span>
                        </div>
                      )}
                      {comp.chasis && (
                        <div className="flex items-center gap-1 text-xs">
                          <Car className="h-3 w-3 text-primary" />
                          <span className="font-medium text-muted-foreground">Chasis:</span>
                          <span>{comp.chasis}</span>
                        </div>
                      )}
                      {!comp.motor && !comp.chasis && "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {comp.tipo && (
                        <Badge variant="secondary" className="text-[10px] w-fit">
                          {comp.tipo}
                        </Badge>
                      )}
                      {comp.variante && (
                        <span className="text-xs text-muted-foreground italic">
                          {comp.variante}
                        </span>
                      )}
                      {!comp.tipo && !comp.variante && "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {comp.atributosExtra && Object.keys(comp.atributosExtra as object).length > 0 ? (
                        Object.entries(comp.atributosExtra as object).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-[10px] py-0">
                            {key}: {String(value)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {currentItems.map((comp) => (
            <div key={comp.id} className="border rounded-xl p-4 space-y-3 bg-muted/10">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base">
                    {comp.marca} {comp.modelo}
                  </h4>
                  <p className="text-sm font-semibold text-primary">{comp.anio}</p>
                </div>
                {comp.tipo && (
                  <Badge variant="secondary" className="text-xs">
                    {comp.tipo}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {comp.motor && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Settings className="h-3 w-3" /> Motor
                    </span>
                    <p className="font-medium">{comp.motor}</p>
                  </div>
                )}
                {comp.chasis && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Car className="h-3 w-3" /> Chasis
                    </span>
                    <p className="font-medium">{comp.chasis}</p>
                  </div>
                )}
                {comp.variante && (
                  <div className="col-span-2 space-y-1">
                    <span className="text-xs text-muted-foreground block">Variante</span>
                    <p className="font-medium">{comp.variante}</p>
                  </div>
                )}
              </div>

              {comp.atributosExtra && Object.keys(comp.atributosExtra as object).length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(comp.atributosExtra as object).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-[10px]">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
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
