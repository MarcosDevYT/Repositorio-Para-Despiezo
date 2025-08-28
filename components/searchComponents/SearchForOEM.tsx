"use client";

import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchForm } from "./SearchForm";

export const SearchForOEM = () => {
  return (
    <Card className="w-[290px] md:w-full group bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 gap-2">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <Search className="h-8 w-8 text-blue-500" />
        </div>
        <CardTitle className="text-xl">
          Búsqueda por Número de Referencia
        </CardTitle>
        <CardDescription>
          Busca partes usando el número de parte original del fabricante
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchForm />
        <div className="text-xs text-muted-foreground text-center">
          <p>Ejemplos: 04465-42180, MR968274, 13780-65J00</p>
        </div>
      </CardContent>
    </Card>
  );
};
