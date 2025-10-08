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
          <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-2 rounded-lg border border-border shadow-md bg-white space-y-6 relative"
              >
                {/* Boton para editar */}

                <Skeleton className="rounded-full absolute top-2 right-2 z-10 size-6" />

                <figure className="w-full h-32">
                  <Skeleton className="w-full h-full" />
                </figure>

                <div>
                  <Skeleton className="h-5 w-full mb-1.5" />
                  <div className="font-medium space-y-1">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3">
                    <Skeleton className="h-8 w-full" />

                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <SellTable products={products} handle={handleDeleteProduct} />
      )}
    </Card>
  );
};
