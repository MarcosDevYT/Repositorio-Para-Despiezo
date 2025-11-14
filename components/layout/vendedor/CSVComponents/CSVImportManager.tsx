"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSVProductCard } from "./CSVProductCard";
import Papa from "papaparse";
import {
  CSVProductData,
  CSVProductWithMissingData,
  csvProductSchema,
} from "@/lib/zodSchemas/csvImportSchema";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importCSVProductsAction } from "@/actions/sell-actions";
import { useRouter } from "next/navigation";

const acceptableCSVFileTypes =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

export const CSVImportManager = () => {
  const [products, setProducts] = useState<CSVProductWithMissingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    Papa.parse<CSVProductData>(file, {
      skipEmptyLines: true,
      header: true,
      complete: (results: Papa.ParseResult<CSVProductData>) => {
        try {
          const parsedProducts: CSVProductWithMissingData[] = results.data.map(
            (row: CSVProductData, index: number) => {
              // Validar cada producto
              const validation = csvProductSchema.safeParse(row);
              const errors: string[] = [];

              if (!validation.success) {
                validation.error.issues.forEach((err: any) => {
                  errors.push(`${err.path.join(".")}: ${err.message}`);
                });
              }

              return {
                ...row,
                id: `csv-product-${Date.now()}-${index}`,
                images: [],
                category: "",
                subcategory: "",
                errors: errors.length > 0 ? errors : undefined,
              };
            }
          );

          setProducts(parsedProducts);
          toast.success(
            `Se cargaron ${parsedProducts.length} productos del archivo CSV`
          );
        } catch (error: unknown) {
          console.error("Error al procesar CSV:", error);
          toast.error("Error al procesar el archivo CSV");
        } finally {
          setIsLoading(false);
        }
      },
      error: (error: Error) => {
        console.error("Error al parsear CSV:", error);
        toast.error("Error al leer el archivo CSV");
        setIsLoading(false);
      },
    });

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProductUpdate = (
    id: string,
    updates: Partial<CSVProductWithMissingData>
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleProductRemove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Producto eliminado");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportProducts = async () => {
    if (completeProducts.length === 0) {
      toast.error("No hay productos completos para importar");
      return;
    }

    setIsImporting(true);

    try {
      const result = await importCSVProductsAction(completeProducts);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(`${result.imported} productos importados correctamente`);

        if (result.failed && result.failed > 0) {
          toast.warning(`${result.failed} productos fallaron al importar`);
        }

        // Redirigir a la página de productos
        router.push("/vendedor");
      }
    } catch (error) {
      console.error("Error al importar productos:", error);
      toast.error("Error al importar productos");
    } finally {
      setIsImporting(false);
    }
  };

  // Calcular productos completos e incompletos
  const completeProducts = products.filter((p) => {
    const hasImages = p.images.length > 0;
    const hasCategory = !!p.category;

    // Verificar si necesita subcategoría
    const needsSubcategory = p.category && p.subcategory !== undefined;
    const hasSubcategory = needsSubcategory ? !!p.subcategory : true;

    return hasImages && hasCategory && hasSubcategory;
  });

  const incompleteProducts = products.filter(
    (p) => !completeProducts.includes(p)
  );

  return (
    <>
      {products.length === 0 ? (
        <div className="flex justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptableCSVFileTypes}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                Subir archivo CSV
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Vista de productos cargados */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Productos Cargados</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {products.length} productos encontrados •{" "}
                    {completeProducts.length} completos •{" "}
                    {incompleteProducts.length} incompletos
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleUploadClick}
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Cargar otro archivo
                  </Button>
                  <Button variant="outline" onClick={() => setProducts([])}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs para filtrar productos */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">Todos ({products.length})</TabsTrigger>
              <TabsTrigger value="incomplete">
                Incompletos ({incompleteProducts.length})
              </TabsTrigger>
              <TabsTrigger value="complete">
                Completos ({completeProducts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {products.map((product) => (
                <CSVProductCard
                  key={product.id}
                  product={product}
                  onUpdate={handleProductUpdate}
                  onRemove={handleProductRemove}
                />
              ))}
            </TabsContent>

            <TabsContent value="incomplete" className="space-y-4 mt-6">
              {incompleteProducts.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    ¡Todos los productos están completos!
                  </p>
                </Card>
              ) : (
                incompleteProducts.map((product) => (
                  <CSVProductCard
                    key={product.id}
                    product={product}
                    onUpdate={handleProductUpdate}
                    onRemove={handleProductRemove}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="complete" className="space-y-4 mt-6">
              {completeProducts.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Aún no hay productos completos. Completa la información
                    faltante.
                  </p>
                </Card>
              ) : (
                completeProducts.map((product) => (
                  <CSVProductCard
                    key={product.id}
                    product={product}
                    onUpdate={handleProductUpdate}
                    onRemove={handleProductRemove}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Botón para guardar todos los productos */}
          {completeProducts.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    ¿Listo para importar los productos?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {completeProducts.length} productos listos para ser
                    importados
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleImportProducts}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    `Importar ${completeProducts.length} productos`
                  )}
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Input oculto para cargar archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptableCSVFileTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};
