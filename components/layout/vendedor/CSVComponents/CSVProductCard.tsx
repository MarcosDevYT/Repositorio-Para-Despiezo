"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/upload-thing";
import { X, Upload, AlertCircle } from "lucide-react";
import { CSVProductWithMissingData } from "@/lib/zodSchemas/csvImportSchema";
import { categories } from "@/lib/constants/data";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CSVProductCardProps = {
  product: CSVProductWithMissingData;
  onUpdate: (id: string, updates: Partial<CSVProductWithMissingData>) => void;
  onRemove: (id: string) => void;
};

export const CSVProductCard = ({
  product,
  onUpdate,
  onRemove,
}: CSVProductCardProps) => {
  const [showUpload, setShowUpload] = useState(true);

  const handleImageUpload = (urls: string[]) => {
    onUpdate(product.id, { images: [...product.images, ...urls] });
    setShowUpload(false);
  };

  const handleImageDelete = (indexToRemove: number) => {
    const updatedImages = product.images.filter((_, i) => i !== indexToRemove);
    onUpdate(product.id, { images: updatedImages });
    if (updatedImages.length === 0) {
      setShowUpload(true);
    }
  };

  const handleCategoryChange = (category: string) => {
    onUpdate(product.id, { category, subcategory: "" });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    onUpdate(product.id, { subcategory });
  };

  const selectedCategory = categories.find(
    (cat) => cat.slug === product.category
  );
  const subcategories = selectedCategory?.subcategories ?? [];
  const hasSubcategories = subcategories.length > 0;

  const isComplete =
    product.images.length > 0 &&
    product.category &&
    (!hasSubcategories || product.subcategory);

  return (
    <Card className="w-full p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sección de imágenes - Izquierda */}
        <div className="w-full lg:w-80 shrink-0">
          {product.images.length === 0 ? (
            <div className=" rounded-lg h-80 flex items-center justify-center bg-gray-50">
              {showUpload ? (
                <div className="w-full h-full">
                  <UploadDropzone
                    endpoint="productImageUploader"
                    className="h-full"
                    content={{
                      label: "Arrastra imágenes aquí",
                      button: "Subir imágenes",
                    }}
                    onClientUploadComplete={(res) => {
                      const urls = res.map((r) => r.url);
                      handleImageUpload(urls);
                    }}
                    onUploadError={() => {
                      alert("Error al subir las imágenes");
                    }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Haz clic para subir imágenes
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowUpload(true)}
                  >
                    Subir imágenes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Imagen principal */}
              <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Miniaturas */}
              <div className="flex gap-2 flex-wrap">
                {product.images.map((image, index) => (
                  <div key={index} className="relative size-16 group">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover rounded border"
                    />
                    <Button
                      type="button"
                      onClick={() => handleImageDelete(index)}
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}

                {/* Botón para agregar más imágenes */}
                {product.images.length < 10 && (
                  <button
                    onClick={() => setShowUpload(true)}
                    className="size-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información del producto - Derecha */}
        <div className="flex-1 space-y-4">
          {/* Errores de validación */}
          {product.errors && product.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {product.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Título y precio */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product.brand} {product.model} • {product.year}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                €{product.price}
              </p>
              {product.offer === "true" && product.offerPrice && (
                <p className="text-sm text-gray-500 line-through">
                  €{product.offerPrice}
                </p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-gray-700">{product.description}</p>

          {/* Información en grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-500">OEM:</span>
              <p className="font-medium">{product.oemNumber}</p>
            </div>
            <div>
              <span className="text-gray-500">Tipo:</span>
              <p className="font-medium capitalize">{product.tipoDeVehiculo}</p>
            </div>
            <div>
              <span className="text-gray-500">Condición:</span>
              <p className="font-medium capitalize">
                {product.condition.replace("-", " ")}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Tipo de pieza:</span>
              <p className="font-medium">{product.typeOfPiece}</p>
            </div>
            <div>
              <span className="text-gray-500">Peso:</span>
              <p className="font-medium">{product.weight} kg</p>
            </div>
            <div>
              <span className="text-gray-500">Dimensiones:</span>
              <p className="font-medium">
                {product.length}x{product.width}x{product.height} cm
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Ubicación:</span>
              <p className="font-medium">{product.location}</p>
            </div>
          </div>

          {/* Selects de categoría y subcategoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={product.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Subcategoría
                {hasSubcategories && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={product.subcategory}
                onValueChange={handleSubcategoryChange}
                disabled={!product.category || !hasSubcategories}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !product.category
                        ? "Selecciona primero una categoría"
                        : hasSubcategories
                        ? "Selecciona una subcategoría"
                        : "Esta categoría no tiene subcategorías"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estado de completitud y botón eliminar */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {isComplete ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="size-2 rounded-full bg-green-600" />
                  <span className="text-sm font-medium">Producto completo</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="size-4" />
                  <span className="text-sm font-medium">
                    Faltan datos requeridos
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(product.id)}
            >
              <X className="size-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
