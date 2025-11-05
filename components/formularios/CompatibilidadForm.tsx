"use client";

import { useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { compatibilidadSchema } from "@/lib/zodSchemas/ReviewSchemas";

export const CompatibilidadForm = ({ productId }: { productId?: string }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof compatibilidadSchema>>({
    resolver: zodResolver(compatibilidadSchema),
    defaultValues: {
      encajo: false,
      modelo: "",
      anio: "",
      version: "",
    },
  });

  const onSubmit = (data: z.infer<typeof compatibilidadSchema>) => {
    startTransition(async () => {
      try {
        // Ejemplo: enviar al backend
        // await saveCompatibilidadAction(productId, data);
        toast.success("Compatibilidad registrada correctamente ✅");
        form.reset();
      } catch (err) {
        toast.error("Ocurrió un error al guardar la compatibilidad");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Pregunta principal */}
        <FormField
          control={form.control}
          name="encajo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿La pieza encajó correctamente?</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="true"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    Sí
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="false"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    No
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modelo del vehículo */}
        <FormField
          control={form.control}
          name="modelo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: Toyota Corolla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Año del vehículo */}
        <FormField
          control={form.control}
          name="anio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: 2021" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Versión del vehículo */}
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versión (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: XEi, LE, GT, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" /> Enviando...
            </>
          ) : (
            "Registrar compatibilidad"
          )}
        </Button>
      </form>
    </Form>
  );
};
