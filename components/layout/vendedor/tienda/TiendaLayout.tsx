"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";
import { TiendaSkeleton } from "@/components/skeletons/TiendaSkeleton";
import { TiendaTabs } from "./TiendaTabs";
import { getVendorFullData } from "@/actions/sell-actions";
import { TiendaHeader } from "./TiendaHeader";

import Link from "next/link";
import { Kit, Product, User } from "@prisma/client";

export type VendorAnalytics = {
  averageMinutes: number | null;
  responses: number;
  dispatch: {
    averageDays: number | null;
    isFastShipper: boolean | 0 | null;
  };
};

export type VendorCounts = {
  publicados: number;
  vendidos: number;
  noVendidos: number;
};

export interface VendorFullDataResponse {
  user: User | null;
  products: (Product & { isFavorite?: boolean })[];
  total: number;
  page: number;
  limit: number;
  counts: VendorCounts | null;
  analytics: VendorAnalytics | null;
}

export const TiendaLayout = ({
  id,
  limit,
  page,
  kits,
}: {
  id: string;
  page?: string;
  limit?: string;
  kits: Kit[];
}) => {
  const router = useRouter();
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendedorInfo, setVendedorInfo] = useState<User | null>();
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);
  const [vendedorData, setVendedorData] = useState<VendorFullDataResponse>({
    user: null,
    products: [],
    total: 0,
    page: 1,
    limit: 10,
    counts: null,
    analytics: null,
  });

  const fetchVendedorInfo = () => {
    startTransition(async () => {
      try {
        const res = await getVendorFullData(id, pageNumber, limitNumber);

        if (!res) {
          setVendedorInfo(null);
          setProducts([]);
          setTotal(0);
          return;
        }

        setProducts(res.products);
        setVendedorInfo(res.user);
        setTotal(res.total);
        setVendedorData(res);
      } catch (error) {
        console.error(error);
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
    fetchVendedorInfo();
  }, [id, limit, page]);

  console.log(vendedorData);

  if (isPending) {
    return <TiendaSkeleton />;
  }

  if (!vendedorInfo)
    return (
      <div className="h-full flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
        <p className="text-muted-foreground mb-4">
          Busca otro vendedor o vuelve al inicio para seguir buscando productos
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
      <TiendaHeader vendedorData={vendedorData} />

      {/* Productos del vendedor */}
      <TiendaTabs
        products={products}
        currentPage={currentPage}
        isPending={isPending}
        handlePageChange={handlePageChange}
        limitNumber={limitNumber}
        total={total}
        kits={kits}
      />
    </div>
  );
};
