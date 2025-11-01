"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { kitSchema } from "@/lib/zodSchemas/kitSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/generated/prisma/client";

type KitFormProps = {
  products: Product[];
  action: (
    data: z.infer<typeof kitSchema> & { price: number; images: string[] }
  ) => Promise<{ error?: string; success?: string }>;
  initialValues?: Partial<z.infer<typeof kitSchema>>;
  mode?: "create" | "edit";
};

export function SellKitForm({
  products,
  action,
  initialValues,
  mode = "create",
}: KitFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof kitSchema>>({
    resolver: zodResolver(kitSchema),
    defaultValues: {
      name: "",
      description: "",
      discount: undefined,
      productIds: [],
      ...initialValues,
    },
  });

  const selected = form.watch("productIds");
  const discountValue = form.watch("discount") || "";
  const discountNumber = discountValue ? Number(discountValue) : 0;

  const selectedProducts = products.filter((p) => selected.includes(p.id));
  const total = selectedProducts.reduce((acc, p) => acc + Number(p.price), 0);
  const finalPrice = total - (total * discountNumber) / 100;

  const toggleProduct = (id: string) => {
    const current = form.getValues("productIds");
    if (current.includes(id)) {
      form.setValue(
        "productIds",
        current.filter((pid) => pid !== id)
      );
    } else {
      form.setValue("productIds", [...current, id]);
    }
  };

  const onSubmit = async (data: z.infer<typeof kitSchema>) => {
    startTransition(async () => {
      try {
        if (data.productIds.length === 0) {
          setError("Debes seleccionar al menos un producto");
          toast.error("Debes seleccionar al menos un producto");
          return;
        }

        const selectedImages = selectedProducts
          .map((p) => p.images?.[0])
          .filter(Boolean) as string[];

        const result = await action({
          ...data,
          price: finalPrice,
          images: selectedImages,
        });

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else {
          toast.success(result.success);
          router.push("/vendedor/kits");
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al guardar el kit";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Nombre y Descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-16">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Kit</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Kit de filtros premium" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="Ej. 10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción del Kit</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Incluye filtros de aire, aceite y combustible..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Productos seleccionables */}
        <div className="space-y-3">
          <FormLabel className="text-xl">
            Selecciona los productos para el kit
          </FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => {
              const isSelected = selected.includes(product.id);
              const isSold = product.status === "vendido";

              return (
                <Card
                  key={product.id}
                  onClick={() => !isSold && toggleProduct(product.id)}
                  className={`cursor-pointer transition-all border-2 p-2 ${
                    isSold
                      ? "opacity-50 border-gray-300"
                      : isSelected
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-muted"
                  }`}
                >
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="rounded-md object-contain h-32 w-full"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${product.price}
                    </p>
                    {isSold && <p className="text-xs text-red-500">Vendido</p>}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Totales */}
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-semibold">${total.toFixed(2)}</span>{" "}
          {discountNumber > 0 && finalPrice > 0 && (
            <>
              → Final con descuento:{" "}
              <span className="font-semibold text-green-600">
                ${finalPrice.toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Botón */}
        <Button
          type="submit"
          disabled={isPending || selectedProducts.length < 2}
          className="rounded-full px-6"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              {mode === "edit" ? "Guardando cambios..." : "Creando kit..."}
            </>
          ) : mode === "edit" ? (
            "Guardar cambios"
          ) : (
            "Crear kit"
          )}
        </Button>
      </form>
    </Form>
  );
}
