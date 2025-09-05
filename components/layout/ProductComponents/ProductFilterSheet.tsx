import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { hasAnyFilter } from "@/lib/utils";
import { categories } from "@/data";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategoria?: string;
  categoria?: string;
  query?: string;
  oem?: string;
  marca?: string;
  modelo?: string;
  estado?: string;
  año?: string;
  tipoDeVehiculo?: string;
  priceMin?: string;
  priceMax?: string;
}

export const ProductFilterSheet = ({
  open,
  onOpenChange,
  subcategoria,
  categoria,
  query,
  oem,
  marca,
  modelo,
  estado,
  año,
  tipoDeVehiculo,
  priceMax,
  priceMin,
}: SidebarProps) => {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const router = useRouter();

  // Estados internos
  const [minPrice, setMinPrice] = useState(priceMin || "");
  const [maxPrice, setMaxPrice] = useState(priceMax || "");
  const [oemInput, setOemInput] = useState(oem || "");
  const [marcaInput, setMarcaInput] = useState(marca || "");
  const [modeloInput, setModeloInput] = useState(modelo || "");
  const [selectEstado, setSelectEstado] = useState(estado || "");
  const [year, setYear] = useState(año || "");
  const [selectTipoVehiculo, setSelectTipoVehiculo] = useState(
    tipoDeVehiculo || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(categoria || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoria || ""
  );
  const [subcategories, setSubcategories] = useState<
    { name: string; slug: string }[]
  >([]);

  // Sincroniza cambios de props con estados internos
  useEffect(() => {
    setMinPrice(priceMin || "");
    setMaxPrice(priceMax || "");
    setYear(año || "");
    setOemInput(oem || "");
    setMarcaInput(marca || "");
    setModeloInput(modelo || "");
    setSelectedCategory(categoria || "");
    setSelectedSubcategory(subcategoria || "");
    setSelectTipoVehiculo(tipoDeVehiculo || "");
    setSelectEstado(estado || "");
  }, [
    categoria,
    subcategoria,
    priceMax,
    priceMin,
    año,
    oem,
    modelo,
    marca,
    tipoDeVehiculo,
    estado,
  ]);

  // Actualiza subcategorías según la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      setSubcategories(cat?.subcategories || []);
      // Resetea subcategoría si no pertenece a la nueva categoría
      if (!cat?.subcategories?.some((s) => s.slug === selectedSubcategory)) {
        setSelectedSubcategory("");
      }
    } else {
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [selectedCategory]);

  const filtros = {
    categoria: selectedCategory,
    subcategoria: selectedSubcategory,
    query,
    oem,
    marca,
    modelo,
    estado,
    año,
    tipoDeVehiculo,
    priceMax,
    priceMin,
  };

  const hayFiltros = hasAnyFilter(filtros);

  // Cambiar categoría
  const onCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);

    // Creamos los parámetros de la URL a partir de los filtros actuales
    const params = new URLSearchParams(window.location.search);

    // Actualizamos categoría
    params.set("categoria", categorySlug);

    // Limpiamos subcategoría si la nueva categoría no la tiene
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat?.subcategories?.some((s) => s.slug === selectedSubcategory)) {
      setSelectedSubcategory("");
      params.delete("subcategoria");
    }

    // Mantenemos los demás filtros
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (query) params.set("query", query);
    if (oem) params.set("oem", oem);
    if (marca) params.set("marca", marca);
    if (estado) params.set("estado", estado);
    if (año) params.set("año", año);
    if (tipoDeVehiculo) params.set("tipoDeVehiculo", tipoDeVehiculo);

    router.push(`/productos?${params.toString()}`);
  };

  // Cambiar subcategoría
  const onSubcategoryChange = (subcategorySlug: string) => {
    setSelectedSubcategory(subcategorySlug);

    const params = new URLSearchParams(window.location.search);

    // Actualizamos subcategoría
    params.set("subcategoria", subcategorySlug);

    // Mantenemos todos los demás filtros
    if (selectedCategory) params.set("categoria", selectedCategory);
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (query) params.set("query", query);
    if (oem) params.set("oem", oem);
    if (marca) params.set("marca", marca);
    if (estado) params.set("estado", estado);
    if (año) params.set("año", año);
    if (tipoDeVehiculo) params.set("tipoDeVehiculo", tipoDeVehiculo);

    router.push(`/productos?${params.toString()}`);
  };

  const onTipodeVehiculoChange = (tipoDeVehiculo: string) => {
    setSelectTipoVehiculo(tipoDeVehiculo);

    const params = new URLSearchParams(window.location.search);

    // Actualizamos el tipovehiculo
    params.set("tipoDeVehiculo", tipoDeVehiculo);

    // Mantenemos todos los demás filtros
    if (selectedCategory) params.set("categoria", selectedCategory);
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (query) params.set("query", query);
    if (oem) params.set("oem", oem);
    if (marca) params.set("marca", marca);
    if (estado) params.set("estado", estado);
    if (año) params.set("año", año);
    if (selectedSubcategory) params.set("subcategoria", selectedSubcategory);

    router.push(`/productos?${params.toString()}`);
  };

  const onOemChange = (value: string) => {
    setOemInput(value);

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("oem", value);
    } else {
      params.delete("oem");
    }

    // Mantenemos todos los demás filtros
    if (selectedCategory) params.set("categoria", selectedCategory);
    if (selectedSubcategory) params.set("subcategoria", selectedSubcategory);
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (query) params.set("query", query);
    if (marcaInput) params.set("marca", marcaInput);
    if (estado) params.set("estado", estado);
    if (year) params.set("año", year);
    if (selectTipoVehiculo) params.set("tipoDeVehiculo", selectTipoVehiculo);

    router.push(`/productos?${params.toString()}`);
  };

  const onMarcaChange = (value: string) => {
    setMarcaInput(value);

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("marca", value);
    } else {
      params.delete("marca");
    }

    // Mantenemos todos los demás filtros
    if (selectedCategory) params.set("categoria", selectedCategory);
    if (selectedSubcategory) params.set("subcategoria", selectedSubcategory);
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (query) params.set("query", query);
    if (oemInput) params.set("oem", oemInput);
    if (estado) params.set("estado", estado);
    if (year) params.set("año", year);
    if (selectTipoVehiculo) params.set("tipoDeVehiculo", selectTipoVehiculo);

    router.push(`/productos?${params.toString()}`);
  };

  const onEstadoChange = (estado: string) => {
    const params = new URLSearchParams(window.location.search);

    if (estado) {
      params.set("estado", estado);
    } else {
      params.delete("estado");
    }

    router.push(`/productos?${params.toString()}`);
  };

  const onModeloChange = (value: string) => {
    setModeloInput(value);

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("modelo", value);
    } else {
      params.delete("modelo");
    }

    // Mantenemos todos los demás filtros
    if (selectedCategory) params.set("categoria", selectedCategory);
    if (selectedSubcategory) params.set("subcategoria", selectedSubcategory);
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (query) params.set("query", query);
    if (oemInput) params.set("oem", oemInput);
    if (marcaInput) params.set("marca", marcaInput);
    if (estado) params.set("estado", estado);
    if (year) params.set("año", year);
    if (selectTipoVehiculo) params.set("tipoDeVehiculo", selectTipoVehiculo);

    router.push(`/productos?${params.toString()}`);
  };

  const onPriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(window.location.search);

    if (min) {
      params.set("priceMin", min);
    } else {
      params.delete("priceMin");
    }

    if (max) {
      params.set("priceMax", max);
    } else {
      params.delete("priceMax");
    }

    router.push(`/productos?${params.toString()}`);
  };

  const onYearChange = (year: string) => {
    const params = new URLSearchParams(window.location.search);

    if (year) {
      params.set("año", year);
    } else {
      params.delete("año");
    }

    router.push(`/productos?${params.toString()}`);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="p-0 bg-white">
        <SheetHeader>
          <SheetTitle className="flex gap-2 items-center">
            <Filter className="size-4" /> Filtros
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto overflow-x-hidden h-full pb-2">
          <div className="space-y-3 w-fit px-4">
            {hayFiltros && (
              <Button
                className="w-full mb-6"
                onClick={() => router.push("/productos")}
              >
                Limpiar todo
              </Button>
            )}

            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Categoría</Label>
              <Select onValueChange={onCategoryChange} value={selectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccioná una categoría" />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-72">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      <div className="flex items-center gap-2">
                        {cat.icon && <cat.icon className="size-4" />}
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategoría */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subcategoría</Label>
                <Select
                  onValueChange={onSubcategoryChange}
                  value={selectedSubcategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccioná una subcategoría" />
                  </SelectTrigger>
                  <SelectContent side="bottom" className="max-h-72">
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.slug} value={sub.slug}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tipo de Vehiculo */}
            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de vehiculo</Label>
              <Select
                onValueChange={onTipodeVehiculoChange}
                value={selectTipoVehiculo}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccioná el vehiculo" />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-72">
                  <SelectItem value="coche">Coche</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                  <SelectItem value="furgoneta">Furgoneta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio */}
            <Separator />
            <div className="space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onPriceChange(minPrice, maxPrice);
                }}
              >
                <Label className="text-sm mb-2 font-medium">
                  Rango de precio
                </Label>
                <div className="flex gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 border rounded px-2 py-1.5"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 border rounded px-2  py-1.5"
                  />
                </div>
                <Button
                  type="submit"
                  className="opacity-0 absolute pointer-events-none overflow-hidden"
                >
                  Aplicar
                </Button>
              </form>
            </div>

            {/* Marca */}
            <Separator />
            <div className="space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onMarcaChange(marcaInput);
                }}
              >
                <Label className="text-sm mb-2 font-medium">Marca</Label>
                <input
                  type="text"
                  placeholder="Ej: Toyota"
                  value={marcaInput}
                  onChange={(e) => setMarcaInput(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-xs"
                />
                <Button
                  type="submit"
                  className="opacity-0 absolute pointer-events-none overflow-hidden"
                >
                  Aplicar
                </Button>
              </form>
            </div>

            {/* Modelo */}
            <Separator />
            <div className="space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onModeloChange(modeloInput);
                }}
              >
                <Label className="text-sm mb-2 font-medium">Modelo</Label>
                <input
                  type="text"
                  placeholder="Ej: Corolla"
                  value={modeloInput}
                  onChange={(e) => setModeloInput(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-xs"
                />
                <Button
                  type="submit"
                  className="opacity-0 absolute pointer-events-none overflow-hidden"
                >
                  Aplicar
                </Button>
              </form>
            </div>

            {/* Año */}
            <Separator />
            <div className="space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onYearChange(year);
                }}
              >
                <Label className="text-sm mb-2 font-medium">
                  Año del vehiculo
                </Label>
                <input
                  type="number"
                  placeholder="2015"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-xs"
                />
                <Button
                  type="submit"
                  className="opacity-0 absolute pointer-events-none overflow-hidden"
                >
                  Aplicar
                </Button>
              </form>
            </div>

            {/* Tipo de Vehiculo */}
            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado del Vehiculo</Label>
              <Select onValueChange={onEstadoChange} value={selectEstado}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccioná un estado" />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-72">
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="usado">Usado</SelectItem>
                  <SelectItem value="defectuoso">Defectuoso</SelectItem>
                  <SelectItem value="verificado">Verificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* OEM */}
            <Separator />
            <div className="space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onOemChange(oemInput);
                }}
              >
                <Label className="text-sm mb-2 font-medium">OEM Number</Label>
                <input
                  type="text"
                  placeholder="Ej: 12345"
                  value={oemInput}
                  onChange={(e) => setOemInput(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-xs"
                />
                <Button
                  type="submit"
                  className="opacity-0 absolute pointer-events-none overflow-hidden"
                >
                  Aplicar
                </Button>
              </form>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
