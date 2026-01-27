"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge"; // Removed duplicate import
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { hasAnyFilter, getYearsFromRange } from "@/lib/utils";

import { EstadoVehiculoFilter } from "@/components/EstadoVehiculoFilter";
import { categories } from "@/lib/constants/data";

type Props = {
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
  counts: {
    condition: Record<string, number>;
  };
};

export const ProductFilters = ({
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
  counts,
}: Props) => {
  const router = useRouter();

  console.log(modelo);

  // Estados internos
  const [minPrice, setMinPrice] = useState(priceMin || "");
  const [maxPrice, setMaxPrice] = useState(priceMax || "");
  const [oemInput, setOemInput] = useState(oem || "");
  const [marcaInput, setMarcaInput] = useState(marca || "");
  const [modeloInput, setModeloInput] = useState(modelo || "");
  const [years, setYears] = useState<string[]>(año ? año.split(",") : []);
  const [yearInput, setYearInput] = useState("");
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
    setYears(año ? año.split(",") : []);
    setOemInput(oem || "");
    setMarcaInput(marca || "");
    setModeloInput(modelo || "");
    setSelectedCategory(categoria || "");
    setSelectedSubcategory(subcategoria || "");
    setSelectTipoVehiculo(tipoDeVehiculo || "");
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
    año: years.length > 0 ? years.join(",") : undefined,
    tipoDeVehiculo,
    priceMax: priceMax ? parseFloat(priceMax) : undefined,
    priceMin: priceMin ? parseFloat(priceMin) : undefined,
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
    if (years.length > 0) params.set("año", years.join(","));
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
    if (years.length > 0) params.set("año", years.join(","));
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
    if (years.length > 0) params.set("año", years.join(","));
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
    if (years.length > 0) params.set("año", years.join(","));
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
    if (years.length > 0) params.set("año", years.join(","));
    if (selectTipoVehiculo) params.set("tipoDeVehiculo", selectTipoVehiculo);

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
    if (years.length > 0) params.set("año", years.join(","));
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

  const onYearChange = (newYear: string) => {
    if (!newYear) return;
    
    const updatedYears = [...years];
    if (!updatedYears.includes(newYear)) {
      updatedYears.push(newYear);
    }
    
    setYears(updatedYears);
    setYearInput("");

    const params = new URLSearchParams(window.location.search);
    params.set("año", updatedYears.join(","));
    router.push(`/productos?${params.toString()}`);
  };

  const removeYear = (y: string) => {
    const updatedYears = years.filter((item) => item !== y);
    setYears(updatedYears);
    
    const params = new URLSearchParams(window.location.search);
    if (updatedYears.length > 0) {
      params.set("año", updatedYears.join(","));
    } else {
      params.delete("año");
    }
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <Card className="w-full h-full gap-0">
      <CardHeader className="border-b [.border-b]:pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {hayFiltros && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => router.push("/productos")}
            >
              Limpiar todo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 filter-class overflow-y-auto pt-4">
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
            <Label className="text-sm mb-2 font-medium">Rango de precio</Label>
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
              onYearChange(yearInput);
            }}
          >
            <Label className="text-sm mb-2 font-medium">Año del vehiculo</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {years.map((y) => (
                <Badge key={y} variant="secondary" className="flex items-center gap-1 pr-1">
                  {y}
                  <button
                    type="button"
                    onClick={() => removeYear(y)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
            <input
              type="number"
              placeholder="Ej: 2015"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
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

        <EstadoVehiculoFilter counts={counts.condition} />

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
      </CardContent>
    </Card>
  );
};
