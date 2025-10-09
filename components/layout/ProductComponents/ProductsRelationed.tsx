"use client";

import { useEffect, useState, useTransition } from "react";
import { getKitsByProductId } from "@/actions/kit-actions";
import {
  getRecommendedProductsByProductId,
  getRelatedProducts,
} from "@/actions/sell-actions";
import { Kit, Product } from "@prisma/client";
import ProductsSlider from "./ProductsSlider";
import { KitCard } from "./KitCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Props {
  vendedorId: string;
  productId: string;
  userId?: string;
}

export default function ProductsRelationed({
  productId,
  vendedorId,
  userId,
}: Props) {
  const [recomendedProducts, setRecomendedProducts] = useState<
    Product[] | null
  >(null);
  const [vendedorProducts, setVendedorProducts] = useState<Product[] | null>(
    null
  );
  const [kitsProduct, setKitsProduct] = useState<Kit[] | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [recommended, vendedor, kits] = await Promise.all([
        getRecommendedProductsByProductId(productId, userId),
        getRelatedProducts(productId, vendedorId, userId),
        getKitsByProductId(productId),
      ]);

      setRecomendedProducts(recommended.length > 0 ? recommended : null);
      setVendedorProducts(vendedor.length > 0 ? vendedor : null);
      setKitsProduct(kits.length > 0 ? kits : null);
    });
  }, [productId, vendedorId]);

  // 🦴 Skeletons
  const SliderSkeleton = () => (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="flex flex-col gap-2 w-full max-w-72 h-[410px] rounded-2xl p-4 animate-pulse"
        >
          <Skeleton className="w-full h-40 rounded-md" />
          <div className="flex flex-row items-center justify-between w-full">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-20 h-5 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  const KitSkeleton = () => (
    <div className="flex flex-col gap-4 w-full p-4 border rounded-xl bg-white animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-16 h-16 rounded-md" />
        ))}
      </div>
      <Skeleton className="w-40 h-4" />
    </div>
  );

  return (
    <section className="container mx-auto flex flex-col gap-16 mt-12">
      {/* 🧩 Kits */}
      {isPending ? (
        <KitSkeleton />
      ) : kitsProduct && kitsProduct.length > 0 ? (
        <article>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Ahorra con los Kits de Productos
            </h2>
          </div>
          {kitsProduct.map((kit) => (
            <KitCard key={kit.id} kit={kit} />
          ))}
        </article>
      ) : null}

      {/* 🛍️ Productos del vendedor */}
      {isPending ? (
        <SliderSkeleton />
      ) : vendedorProducts && vendedorProducts.length > 0 ? (
        <article>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Más Productos del Vendedor</h2>
          </div>
          <ProductsSlider navigation={false} products={vendedorProducts} />
        </article>
      ) : null}

      {/* 💡 Productos recomendados */}
      {isPending ? (
        <SliderSkeleton />
      ) : recomendedProducts && recomendedProducts.length > 0 ? (
        <article>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Productos Recomendados</h2>
          </div>
          <ProductsSlider navigation={false} products={recomendedProducts} />
        </article>
      ) : null}
    </section>
  );
}
