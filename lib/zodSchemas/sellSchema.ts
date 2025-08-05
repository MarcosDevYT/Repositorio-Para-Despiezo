import { z, string } from "zod";

export const sellSchema = z.object({
  name: string({ error: "El Nombre es requerido" })
    .min(1, "El Nombre es requerido")
    .max(255, "El Nombre debe tener menos de 255 caracteres"),
  description: string({ error: "La Descripción es requerida" })
    .min(1, "La Descripción es requerida")
    .max(1000, "La Descripción debe tener menos de 1000 caracteres"),
  oemNumber: string({ error: "El Número OEM es requerido" })
    .min(1, "El Número OEM es requerido")
    .max(255, "El Número OEM debe tener menos de 255 caracteres"),
  price: string({ error: "El Precio es requerido" })
    .min(1, "El Precio es requerido")
    .max(1000000, "El Precio debe tener menos de 1000000"),
  category: z.enum([
    "filtro",
    "aceite",
    "frenos",
    "batería",
    "bujías",
    "otros",
  ]),
  condition: z.enum(["nuevo", "verificado", "usado", "defectuoso"]),
  brand: string({ error: "La Marca es requerida" }),
  model: string({ error: "El Modelo es requerido" }),
  year: string({ error: "El Año es requerido" }),
  status: z.enum(["publicado", "vendido", "cancelado"]),
  typeOfPiece: string({ error: "El Tipo de Pieza es requerido" }),

  // Location
  location: z
    .string({ error: "La Ubicación es requerida" })
    .min(1, "La Ubicación es requerida")
    .max(255, "La Ubicación debe tener menos de 255 caracteres"),

  // Oferta
  offer: z.boolean().optional(),
  offerPrice: z
    .string({ error: "El Precio de la Oferta es requerido" })
    .optional()
    .nullable(),

  // Imágenes
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
});
