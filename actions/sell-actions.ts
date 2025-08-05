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
        userId: session.user.id,
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
        userId: session.user.id,
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

// Obtener todos los productos
export const getProductsAction = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.log(error);
    return {
      error: "Error al obtener los productos",
    };
  }
};
