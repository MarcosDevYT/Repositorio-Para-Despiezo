import { z } from "zod";

// Tipo para los datos del CSV parseado
export type CSVProductData = {
  name: string;
  description: string;
  oemNumber: string;
  price: string;
  brand: string;
  model: string;
  year: string;
  tipoDeVehiculo: "coche" | "moto" | "furgoneta";
  condition: string;
  typeOfPiece: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  location: string;
  offer: string;
  offerPrice?: string;
};

// Tipo extendido con campos adicionales para completar
export type CSVProductWithMissingData = CSVProductData & {
  id: string; // ID temporal para identificar el producto
  images: string[]; // Imágenes a subir
  category: string; // Categoría a seleccionar
  subcategory?: string; // Subcategoría a seleccionar
  errors?: string[]; // Errores de validación
};

// Schema de validación para CSV
export const csvProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  description: z.string().min(1, "La descripción es requerida").max(1000),
  oemNumber: z.string().min(1, "El número OEM es requerido").max(255),
  price: z.string().min(1, "El precio es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.string().min(1, "El año es requerido"),
  tipoDeVehiculo: z.enum(["coche", "moto", "furgoneta"]),
  condition: z.enum([
    "nuevo",
    "como-nuevo",
    "buen-estado",
    "condiciones-aceptables",
    "lo-ha-dado-todo",
  ]),
  typeOfPiece: z.string().min(1, "El tipo de pieza es requerido"),
  weight: z.string().min(1, "El peso es requerido"),
  length: z.string().min(1, "El largo es requerido"),
  width: z.string().min(1, "El ancho es requerido"),
  height: z.string().min(1, "El alto es requerido"),
  location: z.string().min(1, "La ubicación es requerida").max(255),
  offer: z.string(),
  offerPrice: z.string().optional(),
});

export type ValidatedCSVProduct = z.infer<typeof csvProductSchema>;
