"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { baseUrl } from "@/lib/utils";
import { userContactSchema } from "@/lib/zodSchemas/userContactSchema";
import {
  editBusinessDataSchema,
  editProfileSchema,
} from "@/lib/zodSchemas/userSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { z } from "zod";

export type EditableField =
  | "phoneNumber"
  | "businessName"
  | "location"
  | "description"
  | "bussinesCategory";

/**
 * GetUserAction
 * @param userId ID del usuario a buscar
 * @returns Usuario encontrado, si no se encuentra, retorna un error
 */
export const getUserAction = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "Usuario no encontrado",
      };
    }

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.log(error);

    return {
      error: "Error al conseguir el usuario",
    };
  }
};

/**
 * Action para actualizar el perfil del usuario
 * @param data Datos del perfil a actualizar
 * @returns Resultado de la actualización, si hay error, se retorna el error
 */
export const editProfileAction = async (
  data:
    | z.infer<typeof editProfileSchema>
    | z.infer<typeof editBusinessDataSchema>,
  isPhoneChange: boolean,
  isBusinessData: boolean = false
) => {
  try {
    // Verifica si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Valida los datos del perfil
    const validatedData = isBusinessData
      ? editBusinessDataSchema.parse(data)
      : editProfileSchema.parse(data);

    // Actualiza el perfil del usuario
    if (isPhoneChange) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...validatedData,
          phoneVerified: null,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: session.user.id },
        data: validatedData,
      });
    }

    return {
      success: "Perfil actualizado correctamente",
    };
  } catch (error) {
    console.log(error);

    return {
      error: "Error al actualizar el perfil",
    };
  }
};

/**
 * Action para actualizar un campo editable del perfil sin validación Zod
 * @param field - Campo a actualizar
 * @param value - Valor del campo
 * @returns Resultado del update
 */
export const editProfileFieldAction = async (
  field: EditableField,
  value: string
): Promise<{ success?: string; error?: string }> => {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    const isPhoneChange = field === "phoneNumber";

    // Construimos el objeto de update de forma explícita
    // porque Prisma no acepta bien {[field]: value} tipado en TS siempre.
    let updateData: any = {};

    if (field === "bussinesCategory") {
      // Guardamos como array (la DB espera string[])
      // Si value es cadena vacía -> dejamos array vacío
      updateData.bussinesCategory = value && value.trim() !== "" ? [value] : [];
    } else {
      updateData[field] = value;
      if (isPhoneChange) {
        updateData.phoneVerified = null;
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: "Campo actualizado correctamente" };
  } catch (error) {
    console.error("editProfileFieldAction:", error);
    return { error: "Error al actualizar el perfil" };
  }
};

/**
 * Action para actualizar la imagen de perfil del usuario
 * @param imageProfile Imagen de perfil a actualizar
 * @returns Resultado de la actualización, si hay error, se retorna el error
 */
export const updateImageProfile = async (imageProfile: string[]) => {
  try {
    // Verifica si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    const image = imageProfile[0];

    // Valida los datos de la imagen
    const validatedData = z
      .object({
        image: z.string().min(1, "La imagen es requerida"),
      })
      .parse({ image });

    // Verifica si la imagen es un archivo
    if (!image.includes("http")) {
      return {
        error: "La imagen no es un archivo",
      };
    }

    // Actualiza la imagen de perfil del usuario
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: validatedData.image,
      },
    });

    return {
      success: "Imagen actualizada correctamente",
    };
  } catch (error) {
    return {
      error: "Error al actualizar la imagen de perfil",
    };
  }
};

// Agregar un producto a favoritos
export const toggleFavoriteAction = async (productId: string) => {
  console.log("Aplicando favorito");

  // Verificar el usuario logeado
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  // Conseguir el id
  const userId = session.user.id;

  // Verificar si existe
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    // Si existe eliminamos de favoritos
    await prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { success: true, isFavorite: false };
  } else {
    // Si no lo agregamos
    await prisma.favorite.create({
      data: { userId, productId },
    });
    return { success: true, isFavorite: true };
  }
};

/**
 * Funcion para obtener el link de stripeAccount
 */
export async function createStripeAccountLinkAction() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No estás autenticado");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: data?.connectedAccountId as string,
    refresh_url: `${baseUrl}/perfil/configuracion`,
    return_url: `${baseUrl}/payment/return/${data?.connectedAccountId}`,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

/**
 * Funcion para obtener el link del dashboard de stripe para el usuario
 */
export async function getStripeDashboardLinkAction() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("No estás autenticado");
  }

  try {
    const data = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        connectedAccountId: true,
      },
    });

    const loginLink = await stripe.accounts.createLoginLink(
      data?.connectedAccountId as string
    );

    return redirect(loginLink.url);
  } catch (error) {
    console.error("Error liberando el pago:", error);
    throw new Error("No se pudo liberar el pago al vendedor");
  }
}

/**
 * Funcion para cambiar el estado de stripeConnect con el webhook
 */
export async function updateStripeConnectStatusAction(account: Stripe.Account) {
  try {
    const userUpdate = await prisma.user.update({
      where: {
        connectedAccountId: account.id,
      },
      data: {
        stripeConnectedLinked:
          account.capabilities?.transfers === "pending" ||
          account.capabilities?.transfers === "inactive"
            ? false
            : true,
      },
    });

    return userUpdate;
  } catch (error) {
    console.error("Error liberando el pago:", error);
    throw new Error("No se pudo liberar el pago al vendedor");
  }
}

/**
 *
 *  FUNCIONES IMPORTANTES PARA GESTIONAR LAS DIRECCIONES DE ENVIOS
 *
 */

/**
 * Funcion para editar la información de telefono y direcion de envio
 */
export const createUserAddress = async (
  data: z.infer<typeof userContactSchema>,
  addressId?: string,
  isEdit?: boolean
) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    let address = null;

    // Validar con Zod
    const validatedData = userContactSchema.parse(data);

    // 2. Crear o actualizar la dirección
    if (isEdit && addressId) {
      const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
          userId: session.user.id,
          street: validatedData.street,
          number: validatedData.number,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
          isDefault: true,
        },
      });

      address = updatedAddress;
    } else {
      const newAddress = await prisma.address.create({
        data: {
          userId: session.user.id,
          street: validatedData.street,
          number: validatedData.number,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
          isDefault: true,
        },
      });

      address = newAddress;
    }

    if (address === null) return { error: "No se pudo guardar la información" };

    // Opcional: marcar otras direcciones como no default
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        NOT: { id: address.id },
      },
      data: { isDefault: false },
    });

    return { success: true, address };
  } catch (error) {
    console.error("Error creando direccion:", error);
    return { error: "No se pudo guardar la información" };
  }
};

export const deletedUserAddress = async (addressId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "No estás autenticado" };
    }

    // 2. Crear o actualizar la dirección
    await prisma.address.delete({
      where: { id: addressId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creando contacto:", error);
    return { error: "No se pudo guardar la información" };
  }
};

// Funcion para almacenar una busqueda en el historial
export const searchHistoryCreate = async (formData: FormData) => {
  const query = formData.get("query")?.toString() ?? "";
  const session = await auth();

  await prisma.searchHistory.create({
    data: {
      query,
      userId: session?.user?.id ?? null,
    },
  });

  console.log("Busqueda almacenada: ", query);

  // 🔄 Revalida y redirige a /productos con querystring
  revalidatePath("/productos");
  redirect(`/productos?query=${encodeURIComponent(query)}`);
};
