import { z, string } from "zod";

export const userContactSchema = z.object({
  street: string({ error: "El Nombre de la Calle es requerido" })
    .min(1, "El nombre de la Calle es requerido")
    .max(255, "El nombre de la Calle debe tener menos de 255 caracteres"),
  number: string({ error: "El Numero de Calle es requerida" })
    .min(1, "El Numero de Calle es requerido")
    .max(150, "El Numero de Calle debe tener menos de 150 caracteres"),
  city: string({ error: "La Ciudad es requerido" })
    .min(1, "La Ciudad es requerido")
    .max(150, "La Ciudad debe tener menos de 150 caracteres"),
  postalCode: string({ error: "El Codigo Postal es requerida" })
    .min(1, "El Codigo Postal es requerido")
    .max(16, "El Codigo Postal debe tener menos de 16 caracteres"),
  country: string({ error: "El pais es requerido" }),
});
