"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createKit(data: {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  images?: string[];
  productIds: string[];
}) {
  try {
    const session = await auth();
    if (!session) redirect("/login");

    if (!session.user.pro) {
      // Si querías que los Pro puedan crear kits, invertí la condición:
      // if (!session.user.pro) throw new Error("Debes tener el Plan Pro para poder crear un Kit.");
      throw new Error("Debes tener el Plan Pro para poder crear un Kit.");
    }

    // Verificar que el usuario haya seleccionado mas de 2 productos
    if (data.productIds.length < 2) {
      throw new Error(
        "Debes seleccionar al menos 2 productos para crear un Kit.",
      );
    }

    // Verificar productos disponibles
    const products = await prisma.product.findMany({
      where: { id: { in: data.productIds } },
      select: { id: true, status: true },
    });

    const vendidos = products.filter((p) => p.status === "vendido");
    if (vendidos.length > 0) {
      throw new Error("Uno o más productos seleccionados ya fueron vendidos.");
    }

    await prisma.kit.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        images: data.images || [],
        vendorId: session.user.id,
        products: {
          create: data.productIds.map((productId) => ({
            product: { connect: { id: productId } },
          })),
        },
      },
    });

    return { success: "Kit creado correctamente." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear el kit";
    return { error: message };
  }
}

export async function updateKit(
  kitId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    images?: string[];
    productIds?: string[];
  },
) {
  try {
    const session = await auth();
    if (!session?.user) redirect("/login");

    if (!session.user.pro) {
      throw new Error("Debes tener el Plan Pro para poder actualizar un Kit.");
    }

    let newProducts;

    if (data.productIds) {
      // Traemos los productos y sus estados
      const products = await prisma.product.findMany({
        where: { id: { in: data.productIds } },
        select: { id: true, status: true },
      });

      // Filtramos los productos que NO están vendidos
      const disponibles = products.filter((p) => p.status !== "vendido");

      // Si hay productos vendidos, los quitamos y mostramos un aviso
      if (disponibles.length < products.length) {
        console.warn("Algunos productos vendidos fueron eliminados del kit.");
      }

      // Validamos que haya al menos 2 productos válidos
      if (disponibles.length < 2) {
        throw new Error(
          "El kit debe tener al menos 2 productos disponibles (no vendidos).",
        );
      }

      // Eliminamos las relaciones anteriores del kit
      await prisma.kitProduct.deleteMany({ where: { kitId } });

      // Creamos las nuevas relaciones solo con productos válidos
      newProducts = {
        create: disponibles.map((p) => ({
          product: { connect: { id: p.id } },
        })),
      };
    }

    // Actualizamos el kit
    await prisma.kit.update({
      where: { id: kitId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        images: data.images,
        ...(newProducts ? { products: newProducts } : {}),
      },
    });

    return {
      success: "Kit actualizado correctamente.",
      warning:
        newProducts &&
        newProducts.create.length < (data.productIds?.length ?? 0)
          ? "Algunos productos vendidos fueron eliminados del kit."
          : undefined,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar el kit";
    return { error: message };
  }
}

export async function deleteKit(kitId: string) {
  await prisma.kit.delete({
    where: { id: kitId },
  });
  return { success: true };
}

/**
 * Obtener un kit por su ID.
 * Incluye los productos asociados y sus datos completos.
 */
export async function getKitById(kitId: string) {
  try {
    const kit = await prisma.kit.findUnique({
      where: { id: kitId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!kit) {
      return { error: "Kit no encontrado" };
    }

    // Verificar si alguno de los productos del kit fue vendido
    const hasSoldProducts = kit.products.some(
      (kp) => kp.product.status === "vendido",
    );

    // Si tiene productos vendidos, opcionalmente podrías marcarlo o excluirlo
    if (hasSoldProducts) {
      return { error: "Uno o más productos del kit fueron vendidos" };
    }

    return kit;
  } catch (error) {
    console.error("Error al obtener kit:", error);
    return { error: "Error al obtener el kit" };
  }
}

/**
 * Obtener todos los kits.
 * No se mostrarán kits que tengan al menos un producto vendido.
 */
export async function getKits(vendorId?: string) {
  return await prisma.kit.findMany({
    where: {
      ...(vendorId ? { vendorId } : {}),
      // No incluir kits con productos vendidos
      products: {
        none: {
          product: { status: "vendido" },
        },
      },
    },
    include: {
      products: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Obtener todos los kits de un vendedor.
 * Se incluyen todos los kits, aunque tengan productos vendidos.
 */
export async function getVendedorKits(vendorId: string) {
  return await prisma.kit.findMany({
    where: { vendorId },
    include: {
      products: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Obtener un kit por el ID de un producto.
 * Retorna el kit que contiene ese producto, incluyendo todos sus productos.
 */
export async function getKitByProductId(productId: string) {
  return await prisma.kit.findMany({
    where: {
      products: {
        some: {
          // Relación con Product
          productId,
        },
      },
    },
    include: {
      products: {
        include: { product: true },
      },
    },
  });
}

/**
 * Obtener kits que incluyan un producto específico.
 * Prioriza kits con `featuredUntil` vigente (máximo 10).
 * No muestra kits con productos vendidos.
 */
export async function getKitsByProductId(productId: string) {
  const now = new Date();

  // Traer los kits que contengan ese producto
  const kitsRaw = await prisma.kit.findMany({
    where: {
      AND: [
        // Que contenga el producto que queremos
        {
          products: {
            some: { productId },
          },
        },
        // Que **ningún producto** del kit esté vendido
        {
          products: {
            none: { product: { status: "vendido" } },
          },
        },
      ],
    },
    include: {
      products: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Ordenar manualmente para priorizar los destacados vigentes
  const kits = kitsRaw
    .sort((a, b) => {
      const aFeatured = a.featuredUntil && a.featuredUntil >= now ? 1 : 0;
      const bFeatured = b.featuredUntil && b.featuredUntil >= now ? 1 : 0;

      if (aFeatured !== bFeatured) return bFeatured - aFeatured; // destacados arriba

      // luego por fecha de creación
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, 10);

  return kits;
}
