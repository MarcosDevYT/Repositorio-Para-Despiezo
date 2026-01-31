"use client";

import { useEffect, useState, useTransition } from "react";
import { ProductCard } from "@/components/layout/ProductComponents/ProductCard";
import { ProductFilters } from "@/components/layout/ProductComponents/ProductFilters";
import { ProductPagination } from "@/components/layout/ProductComponents/ProductPagination";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getProductsByFilterCached } from "@/actions/action-cache";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductFilterSheet } from "./ProductFilterSheet";
import { ProductType } from "@/types/ProductTypes";
import { ProductsSkeleton } from "@/components/skeletons/ProductsSkeleton";
import { VehicleCard } from "@/components/searchComponents/VehicleCard";
import { getYearsFromRange } from "@/lib/utils";

type Props = {
  params: {
    matriculaoem?: string;
    subcategoria?: string;
    categoria?: string;
    query?: string;
    oem?: string;
    marca?: string;
    modelo?: string;
    estado?: string;
    año?: string;
    tipoDeVehiculo?: string;
    priceMin?: string;
    priceMax?: string;
    page?: string;
    limit?: string;
  };
  initialFilters: Record<string, string | undefined>;
  vehicleData?: any;
};

export const ProductsPageClient = ({ params, initialFilters, vehicleData }: Props) => {
  const {
    query,
    subcategoria,
    categoria,
    oem,
    marca,
    modelo,
    estado,
    año,
    tipoDeVehiculo,
    priceMin,
    priceMax,
    page,
    limit,
  } = params;

  // Use vehicleData.yearRange as fallback for año if searching by plate
  const rawAño = año || (vehicleData?.yearRange ? vehicleData.yearRange : undefined);
  const initialAño = rawAño ? getYearsFromRange(rawAño).join(",") : undefined;

  console.log(modelo);

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [counts, setCounts] = useState<{ condition: Record<string, number> }>({
    condition: {},
  });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageNumber);

  const fetchProducts = () => {
    startTransition(async () => {
      try {
        const { products, total, counts } = await getProductsByFilterCached({
          query,
          categoria,
          subcategoria,
          oem,
          marca,
          estado,
          año: initialAño,
          tipoDeVehiculo,
          priceMin: priceMin ? Number(priceMin) : undefined,
          priceMax: priceMax ? Number(priceMax) : undefined,
          page: Number(page),
          limit: Number(limit),
        });

        setProducts(products);
        setTotal(total);
        setCounts(counts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    });
  };

  // Sync expanded years with URL if needed
  useEffect(() => {
    if (rawAño && rawAño.includes("...") && initialAño && initialAño !== año) {
      const params = new URLSearchParams(window.location.search);
      params.set("año", initialAño);
      router.push(`/productos?${params.toString()}`, { scroll: false });
    }
  }, [initialAño, año, rawAño, router]);

  const handleOpenSheet = () => {
    setOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(initialFilters as any);
    params.set("page", newPage.toString());
    router.push(`/productos?${params.toString()}`);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchProducts();
  }, [params, initialFilters, page, limit]);

  return (
    <>
      <div className="lg:hidden">
        <ProductFilterSheet
          {...initialFilters}
          año={initialAño}
          open={open}
          onOpenChange={setOpen}
        />
      </div>

      <div className="flex gap-4 relative">
        <aside className="hidden lg:flex w-72 h-[80vh] sticky top-20 left-0 right-0 ">
          <ProductFilters 
            counts={counts} 
            {...initialFilters} 
            año={initialAño}
          />
        </aside>

        <section className="flex flex-col gap-4 flex-1 min-h-screen">
          <div className="sticky top-20 pt-2 left-0 right-0 lg:static lg:pt-0 bg-slate-50 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-4 w-full">
            <h1 className="text-xl font-bold">
              {initialFilters.query
                ? `Resultados para: ${initialFilters.query}`
                : "Todos los productos"}
            </h1>

            <div className="flex flex-row w-full lg:w-max justify-between items-center gap-2">
              {isPending ? (
                <Skeleton className="w-28 h-5 rounded-full" />
              ) : (
                <Badge className="rounded-full py-1 text-sm bg-blue-500/10 text-blue-500">
                  {total} productos encontrados
                </Badge>
              )}

              <Button
                onClick={handleOpenSheet}
                size={"sm"}
                className="rounded-full lg:hidden"
              >
                Filtros
              </Button>
            </div>
          </div>

          {/* Ficha del vehículo si existe matrícula */}
          {vehicleData && (
            <div className="mb-4">
              <VehicleCard vehicle={vehicleData} />
            </div>
          )}

          {isPending ? (
            <ProductsSkeleton />
          ) : (
            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-center place-items-center gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={product.isFavorite}
                />
              ))}
            </article>
          )}

          <ProductPagination
            total={total}
            currentPage={currentPage}
            pageSize={limitNumber}
            onPageChange={handlePageChange}
          />
        </section>
      </div>
    </>
  );
};
