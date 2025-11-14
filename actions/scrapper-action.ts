"use server";

import { baseUrl } from "@/lib/utils";

export async function getScrapperOemData(oem: string) {
  try {
    const res = await fetch(`${baseUrl}/api/scrapper-oem?oem=${oem}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error al obtener datos del scrapper: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success || !result.data?.length) {
      throw new Error("No se encontraron resultados para este OEM");
    }

    console.log(result);

    // --- Tomamos el primer resultado o combinamos datos ---
    const item = result.data[0];

    // --- Formateamos la estructura al shape de tu formulario ---
    const formatted = {
      name: item.name || "",
      description: item.description || item.name || "",
      oemNumber: oem,
      price: item.price?.replace(/[^\d.,]/g, "") || "",
      category: "",
      subcategory: "",
      brand: item.reference?.split(" ")?.[1] || "",
      model: "",
      year: "",
      tipoDeVehiculo: "coche",
      condition: item.condition?.toLowerCase().includes("usado")
        ? "usado"
        : "nuevo",
      status: "publicado",
      typeOfPiece: item.description || "",
      weight: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      offer: item.discount ? true : false,
      offerPrice: item.oldPrice?.replace(/[^\d.,]/g, "") || "",
    };

    return formatted;
  } catch (error: any) {
    console.error("Error en getScrapperOemData:", error.message);
    return null;
  }
}
