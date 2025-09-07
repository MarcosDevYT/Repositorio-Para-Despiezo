"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { prisma } from "@/lib/prisma";
import { Product, User } from "@prisma/client";

type VendedorResType = {
  user: User | null;
  products: Product[];
  total: number;
  page: number;
  limit: number;
};

type ProductFilter = {
  query?: string; // nombre o descripción
  categoria?: string; // slug categoría
  subcategoria?: string; // slug subcategoría
  oem?: string; // OEM number
  marca?: string; // brand
  modelo?: string; // modelo
  estado?: string; // condition
  año?: string; // año del vehículo
  tipoDeVehiculo?: string; // coche, moto, furgoneta
  priceMin?: number; // precio mínimo
  priceMax?: number; // precio máximo
  page?: number; // página de paginación
  limit?: number; // cantidad por página
  orderBy?: "price" | "name" | "createdAt"; // campo para ordenar
  orderDirection?: "asc" | "desc"; // dirección
};

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

export const getProductsByFilterAction = async (filters: ProductFilter) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const {
      page = 1,
      limit = 20,
      orderBy = "createdAt",
      orderDirection = "desc",
    } = filters;

    const where: any = {};

    // Búsqueda por texto en nombre o descripción
    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { brand: { contains: filters.query, mode: "insensitive" } },
        { model: { contains: filters.query, mode: "insensitive" } },
        { oemNumber: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    // Búsqueda combinada categoría + subcategoría
    if (filters.categoria && filters.subcategoria) {
      where.AND = [
        { category: filters.categoria },
        { subcategory: filters.subcategoria },
      ];
    } else if (filters.categoria) {
      where.category = filters.categoria;
    } else if (filters.subcategoria) {
      where.subcategory = filters.subcategoria;
    }

    if (filters.oem) where.oemNumber = filters.oem;
    if (filters.marca)
      where.brand = { contains: filters.marca, mode: "insensitive" };

    if (filters.modelo)
      where.model = { contains: filters.modelo, mode: "insensitive" };

    if (filters.estado) where.condition = filters.estado;
    if (filters.año) where.year = filters.año;
    if (filters.tipoDeVehiculo) where.tipoDeVehiculo = filters.tipoDeVehiculo;

    // Filtrado por precio (recordar que price es string)
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.OR = [
        {
          offer: true,
          offerPrice: {
            ...(filters.priceMin !== undefined && {
              gte: filters.priceMin.toString(),
            }),
            ...(filters.priceMax !== undefined && {
              lte: filters.priceMax.toString(),
            }),
          },
        },
        {
          offer: false,
          price: {
            ...(filters.priceMin !== undefined && {
              gte: filters.priceMin.toString(),
            }),
            ...(filters.priceMax !== undefined && {
              lte: filters.priceMax.toString(),
            }),
          },
        },
      ];
    }

    // Conteo total para paginación
    const total = await prisma.product.count({ where });

    // Productos con paginación y orden
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderBy]: orderDirection },
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    return {
      total,
      page,
      limit,
      products: products.map((p) => ({
        ...p,
        isFavorite: userId ? p.favorites.length > 0 : false,
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      total: 0,
      page: 1,
      limit: 20,
      products: [],
    };
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

/**
 * Funcion para obtener la informacion de un vendedor para la tienda
 * @param userId id del vendedor
 * @param page numero de pagina
 * @param limit limite de objectos
 * @returns Retorna la lista de productos, informacion del vendedor y la paginacion
 */
export const getVendedorProductsAndInfo = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<VendedorResType> => {
  try {
    const session = await auth();

    if (!userId) {
      return { user: null, products: [], total: 0, page: 1, limit };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { user: null, products: [], total: 0, page: 1, limit };
    }

    // conteo total de productos del vendedor
    const total = await prisma.product.count({
      where: { vendorId: userId },
    });

    // productos paginados
    const products = await prisma.product.findMany({
      where: { vendorId: userId },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
      orderBy: { createdAt: "desc" }, // opcional, para orden
    });

    return {
      user,
      products: products.map((p) => ({
        ...p,
        isFavorite: session?.user.id ? p.favorites.length > 0 : false,
      })),
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error(error);
    return { user: null, products: [], total: 0, page: 1, limit };
  }
};
