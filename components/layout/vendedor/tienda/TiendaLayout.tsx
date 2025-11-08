"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiendaSkeleton } from "@/components/skeletons/TiendaSkeleton";
import { TiendaTabs } from "./TiendaTabs";
import { TiendaHeader } from "./TiendaHeader";

import { Kit, Product, User, VendorAnalytics } from "@prisma/client";
import { getVendorProductsPaginated } from "@/actions/sell-actions";
import { VendedorReview } from "@/actions/review-actions";

export interface VendorCounts {
  publicados: number;
  vendidos: number;
  noVendidos: number;
}

export const TiendaLayout = ({
  id,
  limit,
  page,
  kits,
  analytics,
  vendedorInfo,
  reviews,
}: {
  id: string;
  page?: string;
  limit?: string;
  kits: Kit[];
  analytics: VendorAnalytics | null;
  vendedorInfo: User | null;
  reviews: VendedorReview[];
}) => {
  const router = useRouter();
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const [isPending, startTransition] = useTransition();

  const [products, setProducts] = useState<
    (Product & { isFavorite?: boolean })[]
  >([]);

  const [total, setTotal] = useState<number>(0);
  const [counts, setCounts] = useState<VendorCounts | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);

  const fetchVendorProducts = () => {
    startTransition(async () => {
      try {
        const res = await getVendorProductsPaginated(
          id,
          pageNumber,
          limitNumber
        );
        if (!res) {
          setProducts([]);
          setTotal(0);
          setCounts(null);
          return;
        }

        setProducts(res.products);
        setTotal(res.counts.total);
        setCounts(res.counts);
      } catch (error) {
        console.error("Error al obtener productos del vendedor:", error);
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    router.push(`/tienda/${id}?${params.toString()}`);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [id, limit, page]);

  if (isPending) {
    return <TiendaSkeleton />;
  }

  if (!products.length && !vendedorInfo)
    return (
      <div className="h-full flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
        <p className="text-muted-foreground mb-4">
          Busca otro vendedor o vuelve al inicio para seguir explorando.
        </p>
        <Button className="text-base rounded-full w-44" asChild>
          <Link href={"/"}>
            <House className="size-5" />
            Inicio
          </Link>
        </Button>
      </div>
    );

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Información del vendedor */}
      <TiendaHeader
        vendedorInfo={vendedorInfo}
        counts={counts}
        analytics={analytics}
      />

      {/* Productos del vendedor */}
      <TiendaTabs
        products={products}
        currentPage={currentPage}
        isPending={isPending}
        handlePageChange={handlePageChange}
        limitNumber={limitNumber}
        total={total}
        kits={kits}
        reviews={reviews}
      />
    </div>
  );
};
