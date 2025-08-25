"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { editProfileSchema } from "@/lib/zodSchemas/userSchema";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Action para actualizar el perfil del usuario
 * @param data Datos del perfil a actualizar
 * @returns Resultado de la actualización, si hay error, se retorna el error
 */
export const editProfileAction = async (
  data: z.infer<typeof editProfileSchema>
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
    const validatedData = editProfileSchema.parse(data);

    // Actualiza el perfil del usuario
    await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
    });

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
