"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Kit, Product } from "@/lib/generated/prisma/client";

interface SellKitCardProps {
  kit: Kit & { products: (Product & { product: Product })[] };
}

export const KitCard = ({ kit }: SellKitCardProps) => {
  // Calculamos total original y ahorro
  const totalOriginal = kit.products.reduce(
    (acc, p) => acc + Number(p.product.price),
    0
  );
  const finalPrice = kit.price; // El precio real del kit con descuento aplicado
  const saved = totalOriginal - finalPrice; // Ahorro

  return (
    <Card className="w-full p-4">
      {/* Título, descripción y botón editar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="text-center md:text-start">
          <h3 className="text-lg font-semibold text-gray-900">{kit.name}</h3>
          <p className="text-sm text-gray-500">{kit.description}</p>
        </div>
        <div className="w-full md:w-36">
          <Button asChild className="rounded-full w-full">
            <Link href={`/kit/${kit.id}`}>Comprar Kit</Link>
          </Button>
        </div>
      </div>

      {/* Productos */}
      <div className="flex flex-row flex-wrap justify-center md:justify-start gap-3 md:gap-x-6">
        {kit.products.map(({ product }) => (
          <Link
            key={product.id}
            href={`/productos/${product.id}`}
            className="flex flex-col items-center w-24 group hover:cursor-pointer"
          >
            <div className="w-16 h-16 relative">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain rounded-md"
              />
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:underline text-center truncate">
              {product.name}
            </span>
            <span className="text-xs text-gray-500">${product.price}</span>
          </Link>
        ))}
      </div>

      {/* Precio total y ahorro */}
      <div className="text-sm text-gray-900 font-semibold">
        Precio final: ${finalPrice.toFixed(2)}
        {saved > 0 && (
          <span className="text-green-600">
            {" "}
            • Ahorras ${saved.toFixed(2)} ({kit.discount}%)
          </span>
        )}
      </div>
    </Card>
  );
};
