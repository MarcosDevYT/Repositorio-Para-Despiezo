"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { prisma } from "@/lib/prisma";

// Crear un producto
export const createProductAction = async (data: z.infer<typeof sellSchema>) => {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Validar los datos del formulario
    const validatedData = sellSchema.parse(data);

    console.log("Datos validados", validatedData);

    // Verificar si el usuario ya tiene un producto con el mismo nombre
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: validatedData.name,
        vendorId: session.user.id,
      },
    });

    if (existingProduct) {
      return {
        error: "Ya tienes un producto con este nombre",
      };
    }

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        vendorId: session.user.id,
      },
    });

    console.log("Producto creado", product);

    return {
      success: "Producto creado correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error al crear el producto",
    };
  }
};

// Editar un producto
export async function updateProductAction(
  id: string,
  data: z.infer<typeof sellSchema>
) {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Validar los datos del formulario
    const validatedData = sellSchema.parse(data);

    console.log("Datos validados", validatedData);

    await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return { success: "Producto actualizado correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al actualizar",
    };
  }
}

// Eliminar un producto
export async function deleteProductAction(id: string) {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        error: "El producto no existe",
      };
    }

    // Verificar si el usuario es el dueño del producto
    if (product.vendorId !== session.user.id) {
      return {
        error: "No tienes permisos para eliminar este producto",
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    return { success: "Producto eliminado correctamente" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al eliminar",
    };
  }
}

// Obtener los productos del usuario
export const getUserProductsAction = async () => {
  try {
    // Verificar si el usuario está autenticado
    const session = await auth();

    if (!session?.user) {
      return {
        error: "No estás autenticado",
      };
    }

    // Obtener los productos del usuario
    const products = await prisma.product.findMany({
      where: {
        vendorId: session.user.id,
      },
    });

    return products;
  } catch (error) {
    console.log(error);
    return {
      error: "Error al obtener los productos",
    };
  }
};

// Obtener todos los productos
export const getProductsAction = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const products = await prisma.product.findMany({
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    return products.map((p) => ({
      ...p,
      isFavorite: userId ? p.favorites.length > 0 : false,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Obtener todos los productos favoritos del usuario
export const getFavoriteProductsAction = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return [];

    const products = await prisma.product.findMany({
      where: {
        favorites: {
          some: { userId },
        },
      },
      include: {
        favorites: { where: { userId }, select: { id: true } },
      },
    });

    return products.map((p) => ({
      ...p,
      isFavorite: true, // si entró acá, ya es favorito
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Obtener producto por id
export const getProductByIdAction = async (id: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!product) {
      return { error: "El producto no existe" };
    }

    return {
      ...product,
      isFavorite: userId ? product.favorites.length > 0 : false,
    };
  } catch (error) {
    console.log(error);
    return { error: "Error al obtener el producto" };
  }
};
