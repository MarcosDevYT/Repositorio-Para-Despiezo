import { z } from "zod";

export const kitSchema = z.object({
  name: z.string().min(3, "El nombre del kit es obligatorio"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  discount: z
    .number()
    .min(0, "El descuento no puede ser negativo")
    .max(100, "El descuento no puede superar el 100%"),
  productIds: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos un producto"),
});
