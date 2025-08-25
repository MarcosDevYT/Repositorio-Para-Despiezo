"use client";

import {
  deleteProductAction,
  getUserProductsAction,
} from "@/actions/sell-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@prisma/client";
import { Edit, MoreVertical, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * @description Componente de productos para la venta
 * @returns Retorna una tabla con todos los productos que el usuario tiene para vender
 */
export const SellProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // UseEffect para recuperar los productos
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getUserProductsAction();
      if (products) {
        setProducts(products as Product[]);
      }
    };
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

      {/* Card Content */}
      <CardContent>
        <div className="w-full h-full rounded-md border">
          <Table className="w-full">
            {/* Table Header */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Imagen</TableHead>
                <TableHead className="w-[100px]">Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Numero OEM</TableHead>
                <TableHead>Tipo de vehiculo</TableHead>
                <TableHead>Categoría</TableHead>

                <TableHead>Estado</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead className="text-right w-[80px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="w-[100px] h-[100px]">
                    <Image
                      src={product.images[0] || ""}
                      alt="Producto"
                      width={100}
                      height={100}
                      className="rounded-md w-full h-full object-contain"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.oemNumber}</TableCell>
                  <TableCell>{product.tipoDeVehiculo}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    {product.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right w-[80px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} size={"icon"}>
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="p-0">
                          <Link
                            href={`/sell/products/${product.id}`}
                            className="p-1.5 px-2 h-9 w-full flex items-center justify-start gap-2 text-neutral-900"
                          >
                            <Edit className="size-4 text-neutral-900" />
                            Editar
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="p-0">
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant={"ghost"}
                            size={"sm"}
                            className="p-1.5 px-2 h-9 w-full flex items-center justify-start gap-2 text-red-500 hover:text-red-500"
                          >
                            <Trash className="size-4 text-red-500" />
                            Eliminar
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
