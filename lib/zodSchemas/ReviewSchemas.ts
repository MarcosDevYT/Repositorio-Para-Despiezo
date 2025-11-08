import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({
      error: "Debes calificar el producto",
    })
    .min(1, "La calificación mínima es 1 estrella")
    .max(5, "La calificación máxima es 5 estrellas"),
  comentario: z
    .string()
    .max(500, "El comentario debe tener menos de 500 caracteres")
    .optional(),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;

export const compatibilidadSchema = z.object({
  encajo: z.boolean({
    error: "Debes indicar si la pieza encajó",
  }),
  marca: z
    .string({
      error: "Debes seleccionar la marca del vehículo",
    })
    .min(1, "La marca es obligatoria"),
  modelo: z
    .string({
      error: "Debes seleccionar el modelo del vehículo",
    })
    .min(1, "El modelo es obligatorio"),
  anio: z
    .string({
      error: "Debes seleccionar el año del vehículo",
    })
    .regex(/^\d{4}$/, "El año debe tener 4 dígitos (por ejemplo: 2020)"),
  version: z
    .string()
    .max(100, "La versión no puede tener más de 100 caracteres"),
  motorizacion: z
    .string()
    .max(100, "La motorización no puede tener más de 100 caracteres"),
  combustible: z.enum(["gasolina", "diesel", "hibrido", "electrico"]),
  transmision: z.enum(["manual", "automatica"]),
});

export type CompatibilidadSchema = z.infer<typeof compatibilidadSchema>;
