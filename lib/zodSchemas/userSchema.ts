import { z, string } from "zod";

export const editProfileSchema = z.object({
  name: string({ error: "El Nombre es requerido" })
    .min(1, "El Nombre es requerido")
    .max(32, "El Nombre debe tener menos de 32 caracteres"),
  phoneNumber: string({ error: "El Teléfono es requerido" })
    .max(15, "El Teléfono debe tener menos de 15 caracteres")
    .optional(),
  location: string({ error: "La Ubicación es requerida" })
    .max(255, "La Ubicación debe tener menos de 255 caracteres")
    .optional(),
  businessName: string({ error: "El Nombre de la Empresa es requerido" })
    .max(32, "El Nombre de la Empresa debe tener menos de 32 caracteres")
    .optional(),
  description: string({ error: "La Descripción es requerida" })
    .max(500, "La Descripción debe tener menos de 500 caracteres")
    .optional(),
});

export const editBusinessDataSchema = z.object({
  phoneNumber: string({ error: "El Teléfono es requerido" })
    .min(1, "El Teléfono es requerido")
    .max(15, "El Teléfono debe tener menos de 15 caracteres"),
  location: string({ error: "La Ubicación es requerida" })
    .min(1, "La Ubicación es requerida")
    .max(255, "La Ubicación debe tener menos de 255 caracteres"),
  businessName: string({ error: "El Nombre de la Empresa es requerido" })
    .min(1, "El Nombre de la Empresa es requerido")
    .max(32, "El Nombre de la Empresa debe tener menos de 32 caracteres"),
  description: string({ error: "La Descripción es requerida" })
    .max(500, "La Descripción debe tener menos de 500 caracteres")
    .optional(),
});
