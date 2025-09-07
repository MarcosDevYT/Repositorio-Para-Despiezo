import { ProductsPageClient } from "@/components/layout/ProductComponents/ProductsPageClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: any) {
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
    page = "1",
    limit = "20",
  } = searchParams;

  const params = {
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
  };

  const initialFilters = {
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
  };

  return <ProductsPageClient params={params} initialFilters={initialFilters} />;
}
