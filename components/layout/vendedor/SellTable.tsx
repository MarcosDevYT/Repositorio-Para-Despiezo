import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { ProductType } from "@/types/ProductTypes";
import { Edit, Star, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const SellTable = ({
  products,
  handle,
}: {
  products: ProductType[];
  handle: (id: string) => Promise<void>;
}) => {
  return (
    <>
      {/* Card Content */}
      <CardContent>
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-2 rounded-lg border border-border shadow-md bg-white space-y-6 relative"
            >
              {/* Boton para editar */}
              {product.status === "vendido" ? null : (
                <Button
                  asChild
                  className="rounded-full absolute top-2 right-2 z-10"
                >
                  <Link href={`/vendedor/productos/${product.id}`}>
                    <Edit className="size-4 " />
                  </Link>
                </Button>
              )}

              <figure className="w-full h-32 relative">
                <Image
                  src={product.images[0] || ""}
                  alt="Producto"
                  fill
                  className="rounded-md w-full h-full object-contain"
                />
              </figure>

              <div>
                <h3 className="font-medium text-lg line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="font-medium">
                  <p>Precio: ${product.price}</p>
                  <p>Creado: {product.createdAt.toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col gap-1.5 mt-3">
                  <Button
                    asChild
                    className="bg-green-500 rounded-full hover:bg-green-600"
                  >
                    <Link href={`/vendedor/destacar/${product.id}`}>
                      <Star className="size-4" />
                      Destacar
                    </Link>
                  </Button>

                  <Button
                    className="rounded-full"
                    onClick={() => handle(product.id)}
                    variant={"destructive"}
                  >
                    <Trash className="size-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};
