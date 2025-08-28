"use client";

import {
  deleteProductAction,
  getUserProductsAction,
} from "@/actions/sell-actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState, useTransition } from "react";
import { SellTable } from "./SellTable";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductType } from "@/types/ProductTypes";

/**
 * @description Componente de productos para la venta
 * @returns Retorna una tabla con todos los productos que el usuario tiene para vender
 */
export const SellProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isPending, startTranstion] = useTransition();

  const fetchProducts = () => {
    startTranstion(async () => {
      try {
        const products = await getUserProductsAction();
        if (products) {
          setProducts(products as ProductType[]);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  // UseEffect para recuperar los productos
  useEffect(() => {
    fetchProducts();
  }, []);

  // HandleDeleteProduct
  const handleDeleteProduct = async (id: string) => {
    const response = await deleteProductAction(id);
    if (response) {
      const newProducts = products.filter((product) => product.id !== id);
      setProducts(newProducts);
    }
  };

  return (
    <Card className="w-full h-max py-8">
      {/* Card Header */}
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">Tus Productos</CardTitle>
        <CardDescription>
          Gestiona tus productos, agrega, edita o elimina tus productos
        </CardDescription>
      </CardHeader>

      {isPending ? (
        <CardContent>
          <Skeleton className="w-full h-96" />
        </CardContent>
      ) : (
        <SellTable products={products} handle={handleDeleteProduct} />
      )}
    </Card>
  );
};
