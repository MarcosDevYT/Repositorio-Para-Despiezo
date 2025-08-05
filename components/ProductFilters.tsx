import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

/**
 * @description Componente de filtros de productos
 * @returns Componente de filtros de productos
 */
const ProductFilters = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary-dark"
          >
            Limpiar todo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categoría */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Categoría</Label>
          <Select value="todo">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todos</SelectItem>
              <SelectItem value="frenos">Sistema de Frenos</SelectItem>
              <SelectItem value="motor">Motor</SelectItem>
              <SelectItem value="suspension">Suspensión</SelectItem>
              <SelectItem value="electrico">Sistema Eléctrico</SelectItem>
              <SelectItem value="transmision">Transmisión</SelectItem>
              <SelectItem value="carroceria">Carrocería</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Rango de Precio */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Precio</Label>
          <div className="px-2">
            <Slider
              value={[0, 10000]}
              min={0}
              max={10000}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>$10000</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              $0 - $10000
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Estado de la Pieza */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Estado</Label>
          <Select value="nuevo">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nuevo">Nuevo</SelectItem>
              <SelectItem value="usado">Usado</SelectItem>
              <SelectItem value="verificado">Verificado</SelectItem>
              <SelectItem value="defectuoso">Defectuoso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Marca */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Marca</Label>
          <Input
            type="text"
            placeholder="Ej: Toyota, Honda, Ford..."
            className="w-full"
          />
        </div>

        <Separator />

        {/* Año */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Año del vehículo</Label>
          <Select value="2020-2024">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2020-2024">2020-2024</SelectItem>
              <SelectItem value="2015-2019">2015-2019</SelectItem>
              <SelectItem value="2010-2014">2010-2014</SelectItem>
              <SelectItem value="2005-2009">2005-2009</SelectItem>
              <SelectItem value="2000-2004">2000-2004</SelectItem>
              <SelectItem value="1995-1999">1995-1999</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Número OEM */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Número de Referencia</Label>
          <Input type="text" placeholder="Ej: 04465-02280" className="w-full" />
          <p className="text-xs text-muted-foreground">
            Busca por el número de parte original del fabricante
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
