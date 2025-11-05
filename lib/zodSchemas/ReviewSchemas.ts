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
  modelo: z
    .string({
      error: "Debes ingresar el modelo del vehículo",
    })
    .min(1, "El modelo es obligatorio")
    .max(50, "El modelo no puede tener más de 50 caracteres"),
  anio: z
    .string({
      error: "Debes ingresar el año del vehículo",
    })
    .regex(/^\d{4}$/, "El año debe tener 4 dígitos (por ejemplo: 2020)"),
  version: z
    .string()
    .max(50, "La versión no puede tener más de 50 caracteres")
    .optional(),
});

export type CompatibilidadSchema = z.infer<typeof compatibilidadSchema>;
