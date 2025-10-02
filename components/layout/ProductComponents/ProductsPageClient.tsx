"use client";

import { useEffect, useState, useTransition } from "react";
import { ProductCard } from "@/components/layout/ProductComponents/ProductCard";
import { ProductFilters } from "@/components/layout/ProductComponents/ProductFilters";
import { ProductPagination } from "@/components/layout/ProductComponents/ProductPagination";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getProductsByFilterAction } from "@/actions/sell-actions";
import { Product } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductFilterSheet } from "./ProductFilterSheet";

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
};

export const ProductsPageClient = ({ params, initialFilters }: Props) => {
  const {
    query,
    subcategoria,
    categoria,
    oem,
    marca,
    estado,
    año,
    tipoDeVehiculo,
    priceMin,
    priceMax,
    page,
    limit,
  } = params;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageNumber);

  const fetchProducts = () => {
    startTransition(async () => {
      try {
        const { products, total } = await getProductsByFilterAction({
          query,
          categoria,
          subcategoria,
          oem,
          marca,
          estado,
          año,
          tipoDeVehiculo,
          priceMin: priceMin ? Number(priceMin) : undefined,
          priceMax: priceMax ? Number(priceMax) : undefined,
          page: Number(page),
          limit: Number(limit),
        });

        setProducts(products);
        setTotal(total);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    });
  };

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
          open={open}
          onOpenChange={setOpen}
        />
      </div>

      <div className="flex gap-4 relative">
        <aside className="hidden lg:flex w-72 h-max sticky top-20 left-0 right-0 ">
          <ProductFilters {...initialFilters} />
        </aside>

        <section className="flex flex-col gap-4 flex-1 min-h-screen">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 w-full">
            <h1 className="text-xl font-bold">
              {initialFilters.query
                ? `Resultados para: ${initialFilters.query}`
                : "Todos los productos"}
            </h1>

            <div className="flex flex-row items-center gap-2">
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

          {isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="space-y-4 bg-white p-4 shadow-sm">
                  <Skeleton className="h-60 md:h-64 w-full rounded-lg" />

                  <div className="space-y-2">
                    <div className="flex flex-row justify-between">
                      <Skeleton className="h-4 w-16 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>

                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />

                    <div className="flex flex-row justify-between">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
