import { Product } from "@prisma/client";

export interface ProductType extends Product {
  isFavorite?: boolean | undefined;
}
