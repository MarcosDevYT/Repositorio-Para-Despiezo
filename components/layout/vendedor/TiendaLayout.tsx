"use client";

import { getVendedorProductsAndInfo } from "@/actions/sell-actions";
import { Product, User } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Box, Calendar, Check, House, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "../ProductComponents/ProductCard";
import { ProductPagination } from "../ProductComponents/ProductPagination";
import { useRouter } from "next/navigation";

type resType = {
  products: Product[];
  user: User | null;
  total: number;
  page: number;
  limit: number;
};

export const TiendaLayout = ({
  id,
  limit,
  page,
}: {
  id: string;
  page?: string;
  limit?: string;
}) => {
  const router = useRouter();
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendedorInfo, setVendedorInfo] = useState<User | null>();
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);

  const fetchVendedorInfo = () => {
    startTransition(async () => {
      try {
        const res: resType = await getVendedorProductsAndInfo(
          id,
          pageNumber,
          limitNumber
        );

        setProducts(res.products);
        setVendedorInfo(res.user);
        setTotal(res.total);
      } catch (error) {
        console.log(error);
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

  console.log(vendedorInfo);

  if (isPending) {
    return (
      <div className="h-full flex flex-col space-y-8">
        <Card className="border border-border rounded-2xl shadow-sm flex flex-col md:flex-row bg-white p-6 gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col items-center justify-center gap-4 min-w-72">
            {/* Avatar */}
            <Skeleton className="w-28 h-28 rounded-full" />

            {/* Nombre del negocio */}
            <div className="flex flex-col items-center gap-2 text-center w-full">
              <Skeleton className="h-6 w-40 rounded-md" /> {/* BusinessName */}
              <Skeleton className="h-4 w-32 rounded-md" />{" "}
              {/* Nombre usuario */}
            </div>

            {/* Badges (mobile) */}
            <div className="flex md:hidden flex-wrap justify-center gap-2 mt-2 w-full">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* Badges (desktop) */}
            <div className="hidden md:flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />{" "}
              {/* Título "Sobre..." */}
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>

            {/* Datos de contacto */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-44 rounded-md" />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-border">
            <Skeleton className="h-6 w-full" />
          </div>

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
        </div>
      </div>
    );
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
      <section className="border border-border rounded-2xl shadow-sm flex flex-col md:flex-row bg-white">
        {/* Columna izquierda: avatar y nombre */}
        <div className="relative flex flex-col items-center justify-center border-b md:border-b-0 md:border-r p-6 min-w-72 gap-4">
          {/* Avatar */}
          <Avatar className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
            <AvatarImage
              className="object-cover"
              src={vendedorInfo.image || ""}
            />
            <AvatarFallback>{vendedorInfo.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          {/* Nombre del negocio */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {vendedorInfo.businessName ?? "Sin nombre de negocio"}
            </h2>
            <span className="text-sm text-gray-500">{vendedorInfo.name}</span>
          </div>

          {/* Badges (solo mobile) */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 mt-2">
            {vendedorInfo.emailVerified && (
              <span className="bg-green-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Check className="size-5" /> Verificado
              </span>
            )}
            {vendedorInfo.bussinesCategory?.map((cat, i) => (
              <span
                key={i}
                className="bg-blue-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Columna derecha: información detallada */}
        <div className="h-full w-full relative p-6 flex flex-col justify-center gap-4">
          {/* Badges (desktop) */}
          <div className="hidden md:flex flex-wrap gap-2 mb-2">
            {vendedorInfo.emailVerified && (
              <span className="bg-green-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Check className="size-5" /> Verificado
              </span>
            )}
            {vendedorInfo.bussinesCategory?.map((cat, i) => (
              <span
                key={i}
                className="bg-blue-500 text-white font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Descripción */}
          {vendedorInfo.description && vendedorInfo.businessName && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Sobre {vendedorInfo.businessName}
              </h3>
              <p className="text-sm text-gray-600">
                {vendedorInfo.description}
              </p>
            </div>
          )}

          {/* Datos de contacto / info */}
          <div className="space-y-2 text-gray-700 text-sm">
            <p className="flex items-center gap-2">
              <Box className="size-5 text-gray-500" />
              <span className="font-medium">Productos:</span> {total}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-5 text-gray-500" />
              <span className="font-medium">Ubicación:</span>{" "}
              {vendedorInfo.location || "—"}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="size-5 text-gray-500" />
              <span className="font-medium">Miembro desde:</span>{" "}
              {vendedorInfo.createdAt
                ? new Date(vendedorInfo.createdAt).toLocaleDateString()
                : "—"}
            </p>
            {vendedorInfo.phoneNumber && (
              <p className="flex items-center gap-2">
                <Phone className="size-5 text-gray-500" />
                <span className="font-medium">Teléfono:</span>{" "}
                {vendedorInfo.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Productos del vendedor */}
      <section className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-2 bg-white p-4 rounded-2xl shadow-sm border border-border">
          <h1 className="text-2xl font-bold">
            Productos de {vendedorInfo.businessName}
          </h1>

          {isPending ? (
            <Skeleton className="w-28 h-5 rounded-full" />
          ) : (
            <Badge className="rounded-full py-1 text-sm bg-blue-500/10 text-blue-500">
              {total} productos encontrados
            </Badge>
          )}
        </div>

        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={product.isFavorite}
            />
          ))}
        </article>

        <ProductPagination
          total={total}
          currentPage={currentPage}
          pageSize={limitNumber}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
};
