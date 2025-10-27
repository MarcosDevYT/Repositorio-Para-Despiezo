"use client";

import { map, z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState, useTransition } from "react";
import { Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { UploadDropzone } from "@/lib/upload-thing";
import { Label } from "@/components/ui/label";
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { categories, conditions } from "@/data";

type SellFormProps = {
  initialValues?: Partial<z.infer<typeof sellSchema>>;
  action: (
    data: z.infer<typeof sellSchema>
  ) => Promise<
    | { error: string; success?: undefined }
    | { success: string; error?: undefined }
  >;
};

export const SellForm = ({ initialValues, action }: SellFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof sellSchema>>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      name: "",
      description: "",
      oemNumber: "",
      price: "",
      category: "",
      subcategory: "",
      brand: "",
      model: "",
      year: "",
      tipoDeVehiculo: "coche",
      condition: "nuevo",
      status: "publicado",
      typeOfPiece: "",
      weight: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      images: [],
      location: "",
      offer: false,
      offerPrice: "",
      ...initialValues,
    },
  });

  const onSubmit = async (data: z.infer<typeof sellSchema>) => {
    startTransition(async () => {
      try {
        if (data.offer === true) {
          if (data.offerPrice === "") {
            setError("El precio de la oferta es requerido");
            toast.error("El precio de la oferta es requerido");
            return;
          }
        }

        setError(null);

        const result = await action(data);

        if (result?.error) {
          setError(result.error);
        } else {
          toast.success(result.success);
          router.push("/vendedor");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";

        setError(`Error: ${errorMessage}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-16">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Filtro de aceite" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* OEM Number */}
          <FormField
            control={form.control}
            name="oemNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número OEM</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej. 123ABC456" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descripción detallada del producto"
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marca */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Toyota" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Modelo */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Corolla" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Año */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2015" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de pieza */}
          <FormField
            control={form.control}
            name="typeOfPiece"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Pieza</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Motor, suspensión, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Peso de la pieza en kg */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso por unidad (kg)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="30"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Largo de la pieza en cm */}
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largo (cm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="62"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ancho de la pieza en cm*/}
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ancho (cm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="28"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alto de la pieza en cm */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alto (cm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="24"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categoría */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccioná una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="bottom" className="max-h-72">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.slug}
                        className="flex items-center gap-2"
                      >
                        <cat.icon />
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subcategoría */}
          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => {
              const selectedCategory = form.watch("category");
              const categoryObj = categories.find(
                (cat) => cat.slug === selectedCategory
              );
              const subcategories = categoryObj?.subcategories ?? [];

              const hasSubcategories = subcategories.length > 0;

              return (
                <FormItem>
                  <FormLabel>Subcategoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCategory || !hasSubcategories}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !selectedCategory
                              ? "Seleccioná primero una categoría"
                              : hasSubcategories
                                ? "Seleccioná una subcategoría"
                                : "Esta categoría no tiene subcategorías"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent side="bottom" className="max-h-72">
                      {subcategories.map((sub) => (
                        <SelectItem key={sub.slug} value={sub.slug}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Condición */}

          <FormField
            control={form.control}
            name="tipoDeVehiculo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo De Vehiculo</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná el tipo de vehiculo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="coche">Coche</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="furgoneta">Furgoneta</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Condición */}

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condición</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná una condición" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem
                          key={condition.value}
                          value={condition.value}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {condition.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {condition.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estado */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  disabled
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccioná un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Ubicación */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <LocationAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Oferta */}
        <FormField
          control={form.control}
          name="offer"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>¿Tiene oferta?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4 md:flex-row md:col-span-2">
          {/* Precio de Oferta (solo si offer es true) */}
          {form.watch("offer") && (
            <FormField
              control={form.control}
              name="offerPrice"
              render={({ field }) => (
                <FormItem className="max-w-48">
                  <FormLabel>Precio de la oferta</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="2000"
                      type="number"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Precio */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="max-w-48">
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="200" type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Imágenes */}
        <Controller
          control={form.control}
          name="images"
          defaultValue={[]}
          render={({ field }) => {
            const images = field.value || [];

            const handleDelete = (indexToRemove: number) => {
              const updatedImages = images.filter(
                (_, i) => i !== indexToRemove
              );
              field.onChange(updatedImages);
            };

            return (
              <div className="flex flex-col gap-3">
                <Label htmlFor="productImage">Imágenes</Label>

                {images.length > 0 ? (
                  <div className="flex gap-5 flex-wrap">
                    {images.map((image: string, index: number) => (
                      <div className="relative size-[100px]" key={index}>
                        <Image
                          src={image}
                          alt="Product Image"
                          className="size-full object-cover rounded-lg border"
                          width={100}
                          height={100}
                        />

                        <Button
                          type="button"
                          onClick={() => handleDelete(index)}
                          variant="destructive"
                          size="icon"
                          className="absolute -top-3 -right-3 rounded-lg size-7"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="productImageUploader"
                    content={{
                      label: "Arrastra una imagen aquí",
                      button: "Subir imagen",
                    }}
                    onClientUploadComplete={(res) => {
                      const urls = res.map((r) => r.url);
                      field.onChange(urls);
                    }}
                    onUploadError={() => {
                      alert("Error al subir la imagen");
                    }}
                  />
                )}

                {form.formState.errors.images && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.images.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />

        {error && <FormMessage className="text-red-500">{error}</FormMessage>}

        <Button
          type="submit"
          className="w-max px-6 rounded-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {initialValues ? "Editando producto..." : "Creando producto..."}
            </>
          ) : (
            <>{initialValues ? "Editar producto" : "Crear producto"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};
