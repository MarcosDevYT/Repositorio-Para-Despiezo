import { Prisma, Product, OemCompatibilidad } from "@prisma/client";

export interface ProductType extends Product {
  isFavorite?: boolean | undefined;
  oemCompatibilidades?: OemCompatibilidad[];
}

// Tipo para los items de la orden
export type PrismaOrdenItem = Prisma.OrderItemGetPayload<{
  include: { product: true; kit: { include: { products: true } }; buyer: true };
}>;

// Tipo para la orden completa
export type PrismaOrden = Prisma.OrdenGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        kit: { include: { products: true } };
        buyer: true;
      };
    };
    buyer: true;
    vendor: true;
  };
}>;

// Tipo actualizado con la relación products dentro de kit
export type OrdenFull = Prisma.OrdenGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        kit: true;
      };
    };
    buyer: true;
    vendor: true;
  };
}>;
