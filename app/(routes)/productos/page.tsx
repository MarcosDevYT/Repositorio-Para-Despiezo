import { ProductsPageClient } from "@/components/layout/ProductComponents/ProductsPageClient";
import { getVehicleByPlate } from "@/actions/matricula-actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: any) {
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
    page = "1",
    limit = "20",
    matricula,
  } = await searchParams;

  const params = {
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
  };

  const initialFilters = {
    query,
    subcategoria,
    categoria,
    oem,
    modelo,
    marca,
    estado,
    año,
    tipoDeVehiculo,
    priceMin,
    priceMax,
  };

  // Obtener datos del vehículo si hay matrícula
  const vehicleData = matricula ? await getVehicleByPlate(matricula) : null;

  return (
    <ProductsPageClient 
      params={params} 
      initialFilters={initialFilters}
      vehicleData={vehicleData}
    />
  );
}
