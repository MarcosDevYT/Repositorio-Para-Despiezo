"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { compatibilidadSchema } from "@/lib/zodSchemas/ReviewSchemas";
import type { OrdenFull } from "@/types/ProductTypes";
import { saveCompatibilidadAction } from "@/actions/review-actions";

// Datos para los selects
const MARCAS = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Citroën",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Peugeot",
  "Renault",
  "Seat",
  "Škoda",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

const currentYear = new Date().getFullYear();
const ANIOS = Array.from({ length: currentYear - 1989 }, (_, i) =>
  String(currentYear - i)
);

interface ProductoParaCompatibilidad {
  id: string;
  name: string;
  oemNumber: string;
  brand: string;
  model: string;
}

export const CompatibilidadForm = ({ orden }: { orden: OrdenFull }) => {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);

  // Extraer productos de la orden
  const productos: ProductoParaCompatibilidad[] = [];

  if (orden.orderType === "PRODUCT") {
    // Productos individuales
    orden.items.forEach((item) => {
      productos.push({
        id: item.product.id,
        name: item.product.name,
        oemNumber: item.product.oemNumber,
        brand: item.product.brand,
        model: item.product.model,
      });
    });
  } else if (orden.orderType === "KIT") {
    // Productos del kit
    orden.items.forEach((item) => {
      if (item.kit?.products) {
        item.kit.products.forEach((kp) => {
          productos.push({
            id: kp.product.id,
            name: kp.product.name,
            oemNumber: kp.product.oemNumber,
            brand: kp.product.brand,
            model: kp.product.model,
          });
        });
      }
    });
  }

  // Determinar si todos los productos son del mismo vehículo
  const sonDelMismoVehiculo = () => {
    if (productos.length <= 1) return true;

    const primero = productos[0];
    return productos.every(
      (p) =>
        p.oemNumber === primero.oemNumber &&
        p.brand === primero.brand &&
        p.model === primero.model
    );
  };

  const modoUnificado = sonDelMismoVehiculo();
  const totalProductos = productos.length;
  const productoActual = productos[currentStep];

  const form = useForm<z.infer<typeof compatibilidadSchema>>({
    resolver: zodResolver(compatibilidadSchema),
    defaultValues: {
      encajo: true,
      marca: "",
      modelo: "",
      anio: "",
      version: "",
      motorizacion: "",
      combustible: "gasolina",
      transmision: "manual",
    },
  });

  const onSubmit = (data: z.infer<typeof compatibilidadSchema>) => {
    startTransition(async () => {
      try {
        if (modoUnificado) {
          // Guardar compatibilidad para todos los productos
          console.log("Compatibilidad unificada para todos:", {
            productIds: productos.map((p) => p.id),
            data,
          });
          await saveCompatibilidadAction(
            orden,
            productos.map((p) => p.id),
            data
          );
          toast.success(
            "Compatibilidad registrada para todos los productos ✅"
          );
          form.reset();
        } else {
          // Guardar compatibilidad para el producto actual
          console.log(`Compatibilidad para producto ${currentStep + 1}:`, {
            productId: productoActual.id,
            data,
          });
          await saveCompatibilidadAction(orden, [productoActual.id], data);

          if (currentStep < totalProductos - 1) {
            // Ir al siguiente producto
            setCurrentStep(currentStep + 1);
            form.reset();
            toast.success(
              `Compatibilidad registrada para ${productoActual.name} ✅`
            );
          } else {
            // Último producto
            toast.success("¡Todas las compatibilidades registradas! ✅");
            form.reset();
            setCurrentStep(0);
          }
        }
      } catch (err) {
        toast.error("Ocurrió un error al guardar la compatibilidad");
      }
    });
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Indicador de progreso (solo en modo multi-producto) */}
      {!modoUnificado && totalProductos > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Producto {currentStep + 1} de {totalProductos}
            </span>
            <span className="text-muted-foreground">{productoActual.name}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / totalProductos) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Información del producto actual (solo en modo multi-producto) */}
      {!modoUnificado && (
        <div className="p-4 bg-muted rounded-lg space-y-1">
          <p className="font-semibold">{productoActual.name}</p>
          <p className="text-sm text-muted-foreground">
            OEM: {productoActual.oemNumber} | Marca: {productoActual.brand} |
            Modelo: {productoActual.model}
          </p>
        </div>
      )}

      {/* Información en modo unificado */}
      {modoUnificado && totalProductos > 1 && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Esta compatibilidad aplicará a todos los productos ({totalProductos}{" "}
            productos)
          </p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          {/* Pregunta principal: ¿Encajó? */}
          <FormField
            control={form.control}
            name="encajo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿La pieza encajó correctamente?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value ? "true" : "false"}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="encajo-si" />
                      <Label htmlFor="encajo-si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="encajo-no" />
                      <Label htmlFor="encajo-no">No</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marca */}
          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca del vehículo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MARCAS.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Modelo */}
          <FormField
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo del vehículo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ejemplo: Corolla, Golf, 308..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Año */}
          <FormField
            control={form.control}
            name="anio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año del vehículo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el año" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px]">
                    {ANIOS.map((anio) => (
                      <SelectItem key={anio} value={anio}>
                        {anio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Versión / Acabado */}
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versión / Acabado</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ejemplo: GTI, Sport, X-Line..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Motorización */}
          <FormField
            control={form.control}
            name="motorizacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motorización</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ejemplo: 1.6 HDi 110 CV, 2.0 TFSI 200 CV..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Combustible */}
          <FormField
            control={form.control}
            name="combustible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de combustible</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="gasolina"
                        id="combustible-gasolina"
                      />
                      <Label htmlFor="combustible-gasolina">Gasolina</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diesel" id="combustible-diesel" />
                      <Label htmlFor="combustible-diesel">Diésel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="hibrido"
                        id="combustible-hibrido"
                      />
                      <Label htmlFor="combustible-hibrido">Híbrido</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="electrico"
                        id="combustible-electrico"
                      />
                      <Label htmlFor="combustible-electrico">Eléctrico</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transmisión */}
          <FormField
            control={form.control}
            name="transmision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de transmisión</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="transmision-manual" />
                      <Label htmlFor="transmision-manual">Manual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="automatica"
                        id="transmision-automatica"
                      />
                      <Label htmlFor="transmision-automatica">Automática</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones de navegación */}
          <div className="flex gap-2">
            {!modoUnificado && currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isPending}
              >
                <ChevronLeft className="size-4 mr-2" />
                Anterior
              </Button>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className={!modoUnificado && currentStep > 0 ? "" : "w-full"}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Enviando...
                </>
              ) : modoUnificado ? (
                "Registrar compatibilidad"
              ) : currentStep < totalProductos - 1 ? (
                <>
                  Siguiente
                  <ChevronRight className="size-4 ml-2" />
                </>
              ) : (
                "Finalizar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
