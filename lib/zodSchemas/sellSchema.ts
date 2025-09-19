import { categories } from "@/data";
import { z, string } from "zod";

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];

const categoryMap = categories.reduce(
  (acc, cat) => {
    acc[cat.slug] = cat.subcategories?.map((sub) => sub.slug) ?? [];
    return acc;
  },
  {} as Record<string, string[]>
);

export const sellSchema = z
  .object({
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

    category: z.enum(categorySlugs).refine((val) => val !== "", {
      message: "Debes seleccionar una categoría",
    }),

    subcategory: z.string().optional(), // 👈 ahora opcional, validamos después

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

    weight: z
      .number({ message: "El peso es requerido" })
      .positive("El peso debe ser mayor a 0"),

    length: z
      .number({ message: "El largo es requerido" })
      .positive("El largo debe ser mayor a 0"),

    width: z
      .number({ message: "El ancho es requerido" })
      .positive("El ancho debe ser mayor a 0"),

    height: z
      .number({ message: "El alto es requerido" })
      .positive("El alto debe ser mayor a 0"),

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
  })
  .superRefine((data, ctx) => {
    const validSubs = categoryMap[data.category];

    if (validSubs.length > 0) {
      // Si la categoría tiene subcategorías, entonces subcategory es obligatorio
      if (!data.subcategory || !validSubs.includes(data.subcategory)) {
        ctx.addIssue({
          path: ["subcategory"],
          message:
            "La subcategoría es requerida y debe corresponder a la categoría seleccionada",
          code: "custom",
        });
      }
    }
  });
