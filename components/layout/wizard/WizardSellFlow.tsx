"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MainContainer } from "@/components/layout/MainContainer";
import {
  ArrowLeft,
  Search,
  Loader2,
  Hash,
  Car,
  Package,
  Camera,
  MapPin,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { createProductAction } from "@/actions/sell-actions";
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { categories } from "@/lib/constants/data";
import { conditions } from "@/lib/constants/conts";
import { useMarcas } from "@/hooks/use-marcas";
import { useModelos } from "@/hooks/use-modelos";
import { cn } from "@/lib/utils";
import { OemCompatibilityPanel, type CompatAutoFillData } from "./OemCompatibilityPanel";
import { ImageUploader } from "@/components/layout/ImageUploader";

interface Props {
  onBack: () => void;
}

export const WizardSellFlow = ({ onBack }: Props) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSearchingOem, setIsSearchingOem] = useState(false);
  const [oemData, setOemData] = useState<any>(null);
  const router = useRouter();

  const { marcas, loading: marcasLoading } = useMarcas();
  const { getModelosByMarca, getAniosByMarca, loading: modelosLoading } = useModelos();
  const [customBrand, setCustomBrand] = useState(false);
  const [customModel, setCustomModel] = useState(false);

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
      condition: "buen-estado",
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
    },
  });

  const marcaActual = form.watch("brand");
  const modelosFiltrados = marcaActual ? getModelosByMarca(marcaActual) : [];
  const aniosFiltrados = marcaActual ? getAniosByMarca(marcaActual) : [];

  // Fetch OEM data from fastebay API
  const handleOemLookup = async () => {
    const oem = form.getValues("oemNumber");
    if (!oem || !oem.trim()) {
      toast.error("Ingresa un número OEM primero");
      return;
    }

    setIsSearchingOem(true);
    try {
      const res = await fetch(`/api/fastebay?oem=${encodeURIComponent(oem.trim())}`);
      const result = await res.json();

      if (result.success && result.data) {
        setOemData(result.data);

        // Try to auto-fill form fields from the data
        const data = result.data;
        if (data.data && data.data.length > 0) {
          const item = data.data[0];
          if (item.name && !form.getValues("name")) {
            form.setValue("name", item.name);
          }
          if (item.description && !form.getValues("description")) {
            form.setValue("description", item.description || item.name || "");
          }
          if (item.price && !form.getValues("price")) {
            const cleanPrice = String(item.price).replace(/[^\d.,]/g, "");
            form.setValue("price", cleanPrice);
          }
          if (item.typeOfPiece && !form.getValues("typeOfPiece")) {
            form.setValue("typeOfPiece", item.typeOfPiece);
          }
        }
        toast.success("Datos del OEM cargados correctamente");
      } else {
        toast.info("No se encontraron datos para este OEM, pero puedes continuar manualmente.");
      }
    } catch {
      toast.error("Error al buscar datos del OEM");
    } finally {
      setIsSearchingOem(false);
    }
  };

  const handleApplyCompatData = (compatData: CompatAutoFillData) => {
    if (compatData.name) form.setValue("name", compatData.name);
    if (compatData.price) form.setValue("price", compatData.price);
    if (compatData.brand) form.setValue("brand", compatData.brand);
    if (compatData.model) form.setValue("model", compatData.model);
    if (compatData.year) form.setValue("year", compatData.year);
    toast.success("Datos aplicados desde compatibilidades");
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["oemNumber", "brand", "model", "year", "tipoDeVehiculo"]);
      if (isValid) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (step === 2) {
      const isValid = await form.trigger(["name", "description", "category", "condition", "typeOfPiece", "price", "location"]);
      if (isValid) {
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: z.infer<typeof sellSchema>) => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await createProductAction(data);

        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
        } else {
          toast.success("¡Tu primera pieza ha sido publicada!");
          router.push("/vendedor");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
      }
    });
  };

  // Step indicator
  const steps = [
    { num: 1, label: "Vehículo", icon: Car },
    { num: 2, label: "Pieza", icon: Package },
    { num: 3, label: "Fotos", icon: Camera },
  ];

  return (
    <MainContainer className="min-h-[calc(100vh-5rem)] px-4 py-6 md:py-10">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={step === 1 ? onBack : handlePrevStep}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          {step === 1 ? "Volver" : "Paso anterior"}
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Publica tu pieza
          </h2>
          <p className="text-gray-500 text-sm">Rápido, sencillo y gratis</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "flex items-center justify-center size-9 rounded-full text-sm font-bold transition-all",
                    step === s.num
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : step > s.num
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {step > s.num ? <Check className="size-4" /> : <s.icon className="size-4" />}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    step === s.num ? "text-primary" : "text-gray-400"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-primary transition-all duration-500",
                      step > s.num ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ========== STEP 1: Vehicle & OEM ========== */}
            {step === 1 && (
              <div className="space-y-5">
                {/* OEM */}
                <div className="bg-white rounded-xl border p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 rounded-lg p-1.5">
                      <Hash className="size-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Número OEM</h3>
                  </div>
                  <p className="text-sm text-gray-500 -mt-2">
                    Ingresa el OEM para identificar la pieza y cargar compatibilidades.
                  </p>

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="oemNumber"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: 1K0615301AA"
                              className="h-11 font-mono"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={handleOemLookup}
                      disabled={isSearchingOem}
                      className="h-11 px-4"
                    >
                      {isSearchingOem ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Search className="size-4" />
                      )}
                      <span className="hidden sm:inline ml-1.5">
                        {isSearchingOem ? "Buscando..." : "Buscar"}
                      </span>
                    </Button>
                  </div>

                  {/* OEM Compatibility Panel */}
                  {oemData && (
                    <OemCompatibilityPanel
                      data={oemData}
                      oem={form.getValues("oemNumber")}
                      onApplyData={handleApplyCompatData}
                    />
                  )}
                </div>

                {/* Vehicle data */}
                <div className="bg-white rounded-xl border p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-50 rounded-lg p-1.5">
                      <Car className="size-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Datos del vehículo</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Brand */}
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm">Marca</FormLabel>
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline"
                              onClick={() => {
                                setCustomBrand(!customBrand);
                                field.onChange("");
                                form.setValue("model", "");
                                form.setValue("year", "");
                                setCustomModel(false);
                              }}
                            >
                              {customBrand ? "Seleccionar de lista" : "Escribir manual"}
                            </button>
                          </div>
                          {customBrand ? (
                            <FormControl>
                              <Input {...field} placeholder="Ej: Toyota" className="h-10" />
                            </FormControl>
                          ) : (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder={marcasLoading ? "Cargando..." : "Marca"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
                                {marcas.map((m) => (
                                  <SelectItem key={m.id} value={m.marca}>{m.marca}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Model */}
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm">Modelo</FormLabel>
                            {!customBrand && (
                              <button
                                type="button"
                                className="text-xs text-primary hover:underline"
                                onClick={() => {
                                  setCustomModel(!customModel);
                                  field.onChange("");
                                  form.setValue("year", "");
                                }}
                              >
                                {customModel ? "Seleccionar de lista" : "Escribir manual"}
                              </button>
                            )}
                          </div>
                          {customBrand || customModel ? (
                            <FormControl>
                              <Input {...field} placeholder="Ej: Corolla" className="h-10" />
                            </FormControl>
                          ) : (
                            <Select
                              onValueChange={(v) => {
                                const clean = v.replace(/\s*\([^)]*\)\s*$/, "").trim();
                                field.onChange(clean);
                              }}
                              value={modelosFiltrados.find(m =>
                                m.modelo.replace(/\s*\([^)]*\)\s*$/, "").trim() === field.value
                              )?.modelo || ""}
                              disabled={!marcaActual || modelosLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder={modelosLoading ? "Cargando..." : "Modelo"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
                                {modelosFiltrados.map((m) => (
                                  <SelectItem key={m.id} value={m.modelo}>{m.modelo}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Year */}
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Año</FormLabel>
                          {customBrand || customModel ? (
                            <FormControl>
                              <Input {...field} placeholder="Ej: 2020" maxLength={4} className="h-10" />
                            </FormControl>
                          ) : (
                            <Select onValueChange={field.onChange} value={field.value} disabled={!marcaActual || aniosFiltrados.length === 0}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Año" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
                                {aniosFiltrados.map((y) => (
                                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle type */}
                    <FormField
                      control={form.control}
                      name="tipoDeVehiculo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Tipo" />
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

                <div className="flex justify-end">
                  <Button type="button" onClick={handleNextStep} className="h-11 px-8">
                    Siguiente
                    <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ========== STEP 2: Product Details ========== */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-50 rounded-lg p-1.5">
                      <Package className="size-4 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Detalles de la pieza</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ej: Filtro de aceite" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Type of piece */}
                    <FormField
                      control={form.control}
                      name="typeOfPiece"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Tipo de pieza</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ej: Motor, suspensión..." className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-sm">Descripción</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe la pieza en detalle..." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Categoría</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-72">
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subcategory */}
                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => {
                        const selectedCategory = form.watch("category");
                        const categoryObj = categories.find((cat) => cat.slug === selectedCategory);
                        const subcategories = categoryObj?.subcategories ?? [];
                        const hasSubcategories = subcategories.length > 0;

                        return (
                          <FormItem>
                            <FormLabel className="text-sm">Subcategoría</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedCategory || !hasSubcategories}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue
                                    placeholder={
                                      !selectedCategory
                                        ? "Primero elige categoría"
                                        : hasSubcategories
                                        ? "Subcategoría"
                                        : "Sin subcategorías"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-72">
                                {subcategories.map((sub) => (
                                  <SelectItem key={sub.slug} value={sub.slug}>{sub.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Condition */}
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Condición</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Condición" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditions.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Precio (€)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ej: 50" type="number" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl border p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-violet-50 rounded-lg p-1.5">
                      <MapPin className="size-4 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Ubicación</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LocationAutocomplete value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hidden status field */}
                <input type="hidden" {...form.register("status")} />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="h-11 px-6">
                    <ChevronLeft className="size-4 mr-1" />
                    Anterior
                  </Button>
                  <Button type="button" onClick={handleNextStep} className="h-11 px-8">
                    Siguiente
                    <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ========== STEP 3: Images & Submit ========== */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-50 rounded-lg p-1.5">
                      <Camera className="size-4 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Fotos de la pieza</h3>
                  </div>
                  <p className="text-sm text-gray-500 -mt-2">
                    Sube al menos una foto para que los compradores vean tu pieza.
                    Arrastra para reordenar — la primera será la portada.
                  </p>

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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="h-11 px-6">
                    <ChevronLeft className="size-4 mr-1" />
                    Anterior
                  </Button>
                  <Button type="submit" className="h-11 px-8" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Check className="size-4 mr-2" />
                        Publicar pieza
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </MainContainer>
  );
};
