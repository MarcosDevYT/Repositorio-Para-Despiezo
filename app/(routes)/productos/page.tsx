import { ProductsPageClient } from "@/components/layout/ProductComponents/ProductsPageClient";
import { getVehicleByPlate } from "@/actions/matricula-actions";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const { matricula, query, marca, modelo, categoria } = params;

  let title = "Todos los productos";
  
  if (matricula) {
    const vehicleData = await getVehicleByPlate(matricula);
    if (vehicleData) {
      title = `Partes compatibles con ${vehicleData.fullName}`;
    }
  } else if (query) {
    title = `Búsqueda: ${query}`;
  } else {
    const parts = [];
    if (marca) parts.push(marca);
    if (modelo) parts.push(modelo);
    if (categoria) parts.push(categoria);
    if (parts.length > 0) {
      title = parts.join(" - ");
    }
  }

  return {
    title,
    description: `Encuentra repuestos y partes de vehículos en Despiezo. ${title}`,
  };
}

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
