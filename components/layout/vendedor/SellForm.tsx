"use client";

import { z } from "zod";
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
import {
  Loader2,
  X,
  PenLine,
  List,
  Search,
  Car,
  Package,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Check,
  Hash,
  Sparkles,
  Globe,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/layout/ImageUploader";
import { categories } from "@/lib/constants/data";
import { conditions } from "@/lib/constants/conts";
import { getScrapperOemData } from "@/actions/scrapper-action";
import { cn } from "@/lib/utils";
import { useMarcas } from "@/hooks/use-marcas";
import { useModelos } from "@/hooks/use-modelos";
import { OemCompatibilityPanel, type CompatAutoFillData } from "@/components/layout/wizard/OemCompatibilityPanel";

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
  const [customBrand, setCustomBrand] = useState(false);
  const [customModel, setCustomModel] = useState(false);
  const [step, setStep] = useState(1);
  const [oemCompatData, setOemCompatData] = useState<any>(null);
  const [isSearchingScrapper, setIsSearchingScrapper] = useState(false);
  const [isSearchingCompat, setIsSearchingCompat] = useState(false);
  const [showPhysicalDetails, setShowPhysicalDetails] = useState(
    !!(initialValues?.weight || initialValues?.length || initialValues?.width || initialValues?.height)
  );
  const router = useRouter();
  const { marcas, loading: marcasLoading } = useMarcas();
  const { getModelosByMarca, getAniosByMarca, loading: modelosLoading } = useModelos();

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

  // Obtener marca actual del form para filtrar modelos
  const marcaActual = form.watch("brand");
  const modelosFiltrados = marcaActual ? getModelosByMarca(marcaActual) : [];
  const aniosFiltrados = marcaActual ? getAniosByMarca(marcaActual) : [];

  /**
   * Funcion para autocompletar datos del producto desde el OEM (scrapper)
   */
  const handleAutocompletarOEM = async () => {
    const oem = form.getValues("oemNumber");
    if (!oem) return toast.error("Debes ingresar un número OEM");
    setIsSearchingScrapper(true);
    try {
      const data = await getScrapperOemData(oem);
      if (!data) {
        toast.error("No se encontraron datos para autocompletar");
        return;
      }
      form.reset({ ...form.getValues(), ...data } as any);
      // Switch to manual mode if brand/model were filled so they show in Input fields
      if (data.brand) {
        setCustomBrand(true);
        setCustomModel(true);
      }
      toast.success("Datos del OEM cargados correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error buscando datos del OEM");
    } finally {
      setIsSearchingScrapper(false);
    }
  };

  /**
   * Funcion para buscar compatibilidades del OEM
   */
  const handleBuscarCompatibilidades = async () => {
    const oem = form.getValues("oemNumber");
    if (!oem) return toast.error("Debes ingresar un número OEM");
    setIsSearchingCompat(true);
    setOemCompatData(null);
    try {
      const res = await fetch(`/api/fastebay?oem=${encodeURIComponent(oem.trim())}`);
      const compatRes = await res.json();
      if (compatRes?.success && compatRes.data) {
        setOemCompatData(compatRes.data);
      } else {
        setOemCompatData({ empty: true });
        toast.info("No se encontraron compatibilidades para este OEM");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error buscando compatibilidades");
    } finally {
      setIsSearchingCompat(false);
    }
  };

  const handleApplyCompatData = (compatData: CompatAutoFillData) => {
    if (compatData.name) form.setValue("name", compatData.name, { shouldValidate: true });
    if (compatData.price) form.setValue("price", compatData.price, { shouldValidate: true });
    if (compatData.brand) {
      // Switch to manual mode so the text value is visible in the Input
      setCustomBrand(true);
      setCustomModel(true);
      form.setValue("brand", compatData.brand, { shouldValidate: true });
    }
    if (compatData.model) form.setValue("model", compatData.model, { shouldValidate: true });
    if (compatData.year) form.setValue("year", compatData.year, { shouldValidate: true });
    toast.success("Datos aplicados desde compatibilidades");
  };

  const handleNextStep = async () => {
    // Validar campos del paso 1 antes de avanzar
    const step1Fields = ["oemNumber", "brand", "model", "year", "tipoDeVehiculo"] as const;
    const isValid = await form.trigger(step1Fields);
    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        // Limpiar campos físicos si el toggle está desactivado
        if (!showPhysicalDetails) {
          data.weight = undefined;
          data.length = undefined;
          data.width = undefined;
          data.height = undefined;
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

  // Indicador de pasos
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center size-10 rounded-full font-bold text-sm transition-all",
          step === 1
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-primary/10 text-primary"
        )}>
          {step > 1 ? <Check className="size-5" /> : <Car className="size-5" />}
        </div>
        <span className={cn(
          "text-sm font-medium hidden sm:block",
          step === 1 ? "text-primary" : "text-muted-foreground"
        )}>
          Vehículo y OEM
        </span>
      </div>

      <div className="w-12 h-0.5 bg-muted-foreground/20 rounded-full overflow-hidden">
        <div className={cn(
          "h-full bg-primary transition-all duration-500",
          step >= 2 ? "w-full" : "w-0"
        )} />
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center size-10 rounded-full font-bold text-sm transition-all",
          step === 2
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-muted text-muted-foreground"
        )}>
          <Package className="size-5" />
        </div>
        <span className={cn(
          "text-sm font-medium hidden sm:block",
          step === 2 ? "text-primary" : "text-muted-foreground"
        )}>
          Detalles del producto
        </span>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StepIndicator />

        {/* ============ PASO 1: Vehículo y OEM ============ */}
        {step === 1 && (
          <div className="space-y-6">
            {/* ---- Bloque OEM ---- */}
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="size-5 text-primary" />
                  Número OEM
                </h3>
                <p className="text-sm text-muted-foreground">
                  Este número identifica la pieza y se guardará en tu producto.
                  También puedes usarlo para autocompletar datos o buscar compatibilidades.
                </p>
              </div>

              {/* Campo OEM */}
              <FormField
                control={form.control}
                name="oemNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Número OEM</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej. 1K0615301M, 7701478031..."
                        className="h-12 text-base font-mono tracking-wide"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acciones OEM — dos botones separados */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutocompletarOEM}
                  disabled={isSearchingScrapper || isSearchingCompat}
                  className="h-10 flex-1"
                >
                  {isSearchingScrapper ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Buscando datos...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2 text-amber-500" />
                      Autocompletar datos
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBuscarCompatibilidades}
                  disabled={isSearchingScrapper || isSearchingCompat}
                  className="h-10 flex-1"
                >
                  {isSearchingCompat ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Buscando compatibilidades...
                    </>
                  ) : (
                    <>
                      <Globe className="size-4 mr-2 text-blue-500" />
                      Buscar compatibilidades
                    </>
                  )}
                </Button>
              </div>

              {/* Panel de compatibilidades OEM */}
              {isSearchingCompat && (
                <OemCompatibilityPanel
                  data={null}
                  oem={form.getValues("oemNumber")}
                  onApplyData={handleApplyCompatData}
                />
              )}
              {oemCompatData && !oemCompatData.empty && !isSearchingCompat && (
                <OemCompatibilityPanel
                  data={oemCompatData}
                  oem={form.getValues("oemNumber")}
                  onApplyData={handleApplyCompatData}
                />
              )}
            </div>

            {/* ---- Bloque Datos del vehículo ---- */}
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Car className="size-5 text-primary" />
                    Datos del vehículo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Marca, modelo y año del vehículo compatible con esta pieza.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {/* Marca */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-medium">Marca</FormLabel>
                        <button
                          type="button"
                          className="text-xs text-primary/70 hover:text-primary hover:underline flex items-center gap-1 transition-colors"
                          onClick={() => {
                            setCustomBrand(!customBrand);
                            field.onChange("");
                            form.setValue("model", "");
                            form.setValue("year", "");
                            setCustomModel(false);
                          }}
                        >
                          {customBrand ? (
                            <><List className="size-3" /> Seleccionar de lista</>
                          ) : (
                            <><PenLine className="size-3" /> Escribir manualmente</>
                          )}
                        </button>
                      </div>
                      {customBrand ? (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Toyota"
                            className="h-11"
                          />
                        </FormControl>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Selecciona una marca" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-64">
                            {marcasLoading ? (
                              <div className="flex items-center justify-center py-3">
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                              </div>
                            ) : (
                              marcas.map((m) => (
                                <SelectItem key={m.id} value={m.marca}>
                                  {m.marca}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
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
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-medium">Modelo</FormLabel>
                        {!customBrand && (
                          <button
                            type="button"
                            className="text-xs text-primary/70 hover:text-primary hover:underline flex items-center gap-1 transition-colors"
                            onClick={() => {
                              setCustomModel(!customModel);
                              field.onChange("");
                              form.setValue("year", "");
                            }}
                          >
                            {customModel ? (
                              <><List className="size-3" /> Seleccionar de lista</>
                            ) : (
                              <><PenLine className="size-3" /> Escribir manualmente</>
                            )}
                          </button>
                        )}
                      </div>
                      {customBrand || customModel ? (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Corolla"
                            className="h-11"
                          />
                        </FormControl>
                      ) : (
                        <Select
                          onValueChange={(v) => {
                            const modeloLimpio = v.replace(/\s*\([^)]*\)\s*$/, "").trim();
                            field.onChange(modeloLimpio);
                          }}
                          value={modelosFiltrados.find(m =>
                            m.modelo.replace(/\s*\([^)]*\)\s*$/, "").trim() === field.value
                          )?.modelo || ""}
                          disabled={!marcaActual || modelosLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder={modelosLoading ? "Cargando modelos..." : "Selecciona un modelo"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-64">
                            {modelosFiltrados.map((m) => (
                              <SelectItem key={m.id} value={m.modelo}>
                                {m.modelo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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
                      <FormLabel className="text-sm font-medium mb-1">Año</FormLabel>
                      {customBrand || customModel ? (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: 2020"
                            type="text"
                            maxLength={4}
                            className="h-11"
                          />
                        </FormControl>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!marcaActual || aniosFiltrados.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Selecciona un año" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-64">
                            {aniosFiltrados.map((y) => (
                              <SelectItem key={y} value={y.toString()}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tipo de Vehículo */}
                <FormField
                  control={form.control}
                  name="tipoDeVehiculo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-1">Tipo de Vehículo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="coche">Coche</SelectItem>
                          <SelectItem value="moto">Moto</SelectItem>
                          <SelectItem value="furgoneta">Furgoneta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botón Siguiente */}
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleNextStep}
                className="px-8 h-11"
              >
                Siguiente
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ============ PASO 2: Detalles del producto ============ */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="size-5 text-primary" />
                  Información del producto
                </h3>
                <p className="text-sm text-muted-foreground">
                  Completa los detalles de la pieza que deseas publicar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          rows={4}
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
                            <SelectValue placeholder="Selecciona una categoría" />
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
                                    ? "Selecciona primero una categoría"
                                    : hasSubcategories
                                    ? "Selecciona una subcategoría"
                                    : "Sin subcategorías"
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
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una condición" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem
                              key={condition.value}
                              value={condition.value}
                            >
                              <div className="flex gap-1">
                                <span className="font-medium">
                                  {condition.label}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  - {condition.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estado (oculto) */}
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
                            <SelectValue placeholder="Selecciona un estado" />
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
            </div>

            {/* Ubicación */}
            <div className="rounded-xl border bg-card p-6 space-y-6">
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
            </div>

            {/* Precio y Oferta */}
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <h3 className="text-lg font-semibold">Precio</h3>
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                {/* Precio */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-48">
                      <FormLabel>Precio (€)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="200" type="number" />
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
                    <FormItem className="flex items-center gap-3 pb-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">¿Tiene oferta?</FormLabel>
                    </FormItem>
                  )}
                />

                {/* Precio de Oferta */}
                {form.watch("offer") && (
                  <FormField
                    control={form.control}
                    name="offerPrice"
                    render={({ field }) => (
                      <FormItem className="w-48">
                        <FormLabel>Precio de oferta (€)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="150"
                            type="number"
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Detalles físicos (toggle) */}
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="size-5 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Detalles físicos del producto</h3>
                    <p className="text-sm text-muted-foreground">Peso y dimensiones (opcional)</p>
                  </div>
                </div>
                <Switch
                  checked={showPhysicalDetails}
                  onCheckedChange={(checked) => {
                    setShowPhysicalDetails(checked);
                    if (!checked) {
                      form.setValue("weight", undefined);
                      form.setValue("length", undefined);
                      form.setValue("width", undefined);
                      form.setValue("height", undefined);
                    }
                  }}
                />
              </div>

              {showPhysicalDetails && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {/* Peso */}
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
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

                  {/* Largo */}
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

                  {/* Ancho */}
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

                  {/* Alto */}
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
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="text-lg font-semibold">Imágenes</h3>
              <Controller
                control={form.control}
                name="images"
                defaultValue={[]}
                render={({ field }) => (
                  <div className="space-y-2">
                    <ImageUploader
                      images={field.value || []}
                      onChange={field.onChange}
                      maxImages={10}
                    />
                    {form.formState.errors.images && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.images.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {error && <FormMessage className="text-red-500">{error}</FormMessage>}

            {/* Botones de navegación */}
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="px-8 h-11"
              >
                <ChevronLeft className="size-4 mr-1" />
                Anterior
              </Button>

              <Button
                type="submit"
                className="px-8 h-11"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {initialValues ? "Editando producto..." : "Creando producto..."}
                  </>
                ) : (
                  <>{initialValues ? "Editar producto" : "Publicar producto"}</>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
