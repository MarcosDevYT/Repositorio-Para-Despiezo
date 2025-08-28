import { z, string } from "zod";

export const sellSchema = z.object({
  name: string({ message: "El Nombre es requerido" })
    .trim()
    .min(1, "El Nombre es requerido")
    .max(255, "El Nombre debe tener menos de 255 caracteres"),

  description: string({ message: "La Descripción es requerida" })
    .trim()
    .min(1, "La Descripción es requerida")
    .max(1000, "La Descripción debe tener menos de 1000 caracteres"),

  oemNumber: string({ message: "El Número OEM es requerido" })
    .trim()
    .min(1, "El Número OEM es requerido")
    .max(255, "El Número OEM debe tener menos de 255 caracteres"),

  price: string({ message: "El Precio es requerido" })
    .trim()
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

  tipoDeVehiculo: z.enum(["coche", "moto", "furgoneta"]),
  condition: z.enum(["nuevo", "verificado", "usado", "defectuoso"]),

  brand: string({ message: "La Marca es requerida" })
    .trim()
    .min(1, "La Marca es requerida"),

  model: string({ message: "El Modelo es requerido" })
    .trim()
    .min(1, "El Modelo es requerido"),

  year: string({ message: "El Año es requerido" })
    .trim()
    .min(1, "El Año es requerido"),

  status: z.enum(["publicado", "vendido", "cancelado"]),

  typeOfPiece: string({ message: "El Tipo de Pieza es requerido" })
    .trim()
    .min(1, "El Tipo de Pieza es requerido"),

  location: string({ message: "La Ubicación es requerida" })
    .trim()
    .min(1, "La Ubicación es requerida")
    .max(255, "La Ubicación debe tener menos de 255 caracteres"),

  offer: z.boolean().optional(),

  offerPrice: string({ message: "El Precio de la Oferta es requerido" })
    .trim()
    .optional()
    .nullable(),

  images: z
    .array(z.string().trim().min(1, "La imagen no puede estar vacía"))
    .min(1, "Al menos una imagen es requerida"),
});
