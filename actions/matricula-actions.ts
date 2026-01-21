"use server";

import { prisma } from "@/lib/prisma";

// Formato Solvedia/Autodoc (con details)
export interface MatriculaResponseSolvedia {
  success: boolean;
  plate: string;
  timestamp: string;
  data: {
    source: string;
    title: string;
    details: {
      Tipo: string;
      "Año de fabricación (desde - hasta)": string;
      "Tipo de carrocería": string;
      "Tipo de unidad": string;
      "Potencia [kW]": string;
      "Potencia [cv]": string;
      "Cilindrada (cc)": string;
      Cilindros: string;
      "Válvulas para la cámara de combustión": string;
      "Tipo de motor": string;
      "Código de motor": string;
      Transmisión: string;
      "Tipo de combustible": string;
      "Preparación del combustible": string;
      "Sistema de frenos": string;
    };
    fullName: string;
  };
}

// Formato Oscaro (con version)
export interface MatriculaResponseOscaro {
  success: boolean;
  plate: string;
  timestamp: string;
  data: {
    source: string;
    label: string;
    plate: string;
    version: string;
    fullName: string;
  };
  url?: string;
}

// Tipo unión para ambos formatos
export type MatriculaResponse = MatriculaResponseSolvedia | MatriculaResponseOscaro;

export interface MatriculaError {
  success: false;
  error: string;
}

// Helper para detectar si es formato Oscaro o Solvedia
function isOscaroFormat(data: any): data is MatriculaResponseOscaro {
  return data.data && 'version' in data.data && 'label' in data.data;
}

// Helper para normalizar datos para guardar en BD
function normalizeVehicleData(response: MatriculaResponse) {
  const cleanPlate = response.plate.toLowerCase();
  
  if (isOscaroFormat(response)) {
    // Formato Oscaro - extraer info de version y label
    const { data } = response;
    
    // Intentar extraer potencia y cilindrada de la version
    // Ej: "III 2.0 TDI BlueMotion 150 cv"
    const cvMatch = data.version.match(/(\d+)\s*cv/i);
    const powerHp = cvMatch ? `${cvMatch[1]} cv` : null;
    
    const displacementMatch = data.version.match(/(\d+\.\d+)/);
    const displacement = displacementMatch ? `${displacementMatch[1]}L` : null;
    
    return {
      plate: cleanPlate,
      source: data.source,
      title: data.label,
      fullName: data.fullName,
      tipo: null,
      yearRange: null,
      bodyType: null,
      driveType: null,
      powerKw: null,
      powerHp: powerHp,
      displacement: displacement,
      cylinders: null,
      valves: null,
      engineType: null,
      engineCode: null,
      transmission: null,
      fuelType: data.version.includes('TDI') || data.version.includes('Diesel') ? 'Diesel' : 
                data.version.includes('TSI') || data.version.includes('Gasolina') ? 'Gasolina' : null,
      fuelPreparation: null,
      brakeSystem: null,
    };
  } else {
    // Formato Solvedia/Autodoc
    const { data } = response as MatriculaResponseSolvedia;
    return {
      plate: cleanPlate,
      source: data.source,
      title: data.title,
      fullName: data.fullName,
      tipo: data.details.Tipo,
      yearRange: data.details["Año de fabricación (desde - hasta)"],
      bodyType: data.details["Tipo de carrocería"],
      driveType: data.details["Tipo de unidad"],
      powerKw: data.details["Potencia [kW]"],
      powerHp: data.details["Potencia [cv]"],
      displacement: data.details["Cilindrada (cc)"],
      cylinders: data.details.Cilindros,
      valves: data.details["Válvulas para la cámara de combustión"],
      engineType: data.details["Tipo de motor"],
      engineCode: data.details["Código de motor"],
      transmission: data.details.Transmisión,
      fuelType: data.details["Tipo de combustible"],
      fuelPreparation: data.details["Preparación del combustible"],
      brakeSystem: data.details["Sistema de frenos"],
    };
  }
}

// Helper para construir respuesta normalizada desde caché
function buildResponseFromCache(cachedVehicle: any): MatriculaResponseSolvedia {
  return {
    success: true,
    plate: cachedVehicle.plate,
    timestamp: cachedVehicle.updatedAt.toISOString(),
    data: {
      source: cachedVehicle.source,
      title: cachedVehicle.title,
      details: {
        Tipo: cachedVehicle.tipo || "",
        "Año de fabricación (desde - hasta)": cachedVehicle.yearRange || "",
        "Tipo de carrocería": cachedVehicle.bodyType || "",
        "Tipo de unidad": cachedVehicle.driveType || "",
        "Potencia [kW]": cachedVehicle.powerKw || "",
        "Potencia [cv]": cachedVehicle.powerHp || "",
        "Cilindrada (cc)": cachedVehicle.displacement || "",
        Cilindros: cachedVehicle.cylinders || "",
        "Válvulas para la cámara de combustión": cachedVehicle.valves || "",
        "Tipo de motor": cachedVehicle.engineType || "",
        "Código de motor": cachedVehicle.engineCode || "",
        Transmisión: cachedVehicle.transmission || "",
        "Tipo de combustible": cachedVehicle.fuelType || "",
        "Preparación del combustible": cachedVehicle.fuelPreparation || "",
        "Sistema de frenos": cachedVehicle.brakeSystem || "",
      },
      fullName: cachedVehicle.fullName,
    },
  };
}

export async function searchByMatricula(
  matricula: string
): Promise<MatriculaResponse | MatriculaError> {
  if (!matricula || matricula.trim().length === 0) {
    return {
      success: false,
      error: "La matrícula no puede estar vacía",
    };
  }

  const cleanMatricula = matricula.trim().toLowerCase();

  // 1. Intentar buscar en caché (BD) primero
  try {
    const cachedVehicle = await prisma.vehicle.findUnique({
      where: { plate: cleanMatricula },
    });

    if (cachedVehicle) {
      return buildResponseFromCache(cachedVehicle);
    }
  } catch (cacheError) {
    // Si hay error en BD (tabla no existe, etc), continuar con API
    console.log("Caché no disponible, consultando API:", cacheError);
  }

  // 2. Consultar API externa
  try {
    const url = `https://despiezo.solvedia.app/matricula/${cleanMatricula}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Error al buscar matrícula: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || "No se encontró información para esta matrícula",
      };
    }

    // 3. Guardar en BD para futuras consultas (soporta ambos formatos)
    try {
      const normalizedData = normalizeVehicleData(data);
      await prisma.vehicle.create({
        data: normalizedData,
      });
    } catch (dbError) {
      console.error("Error al guardar en BD:", dbError);
      // Continuar aunque falle el guardado
    }

    return data as MatriculaResponse;
  } catch (error) {
    console.error("Error en searchByMatricula:", error);
    return {
      success: false,
      error: "Error al conectar con el servicio de matrícula",
    };
  }
}

// Función para obtener datos de vehículo por matrícula desde BD
export async function getVehicleByPlate(plate: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { plate: plate.toLowerCase() },
    });
    return vehicle;
  } catch (error) {
    console.error("Error al obtener vehículo:", error);
    return null;
  }
}
