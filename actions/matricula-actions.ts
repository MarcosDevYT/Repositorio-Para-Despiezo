"use server";

import { prisma } from "@/lib/prisma";

// Formato de versiones disponibles (cuando no todas están procesadas)
export interface AvailableVersion {
  index: number;
  name: string;
  makerId: string;
  modelId: string;
  carId: string;
}

// Formato Solvedia/Autodoc (con details)
export interface VehicleVersion {
  currentVersionIndex: number;
  versionName: string;
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
  makerId?: string;
  modelId?: string;
  carId?: string;
  processedAt?: string;
}

export interface MatriculaResponseSolvedia {
  success: boolean;
  plate: string;
  timestamp: string;
  hasMultipleVersions: boolean;
  totalVersions: number;
  processedVersionsCount?: number;
  versionsCompleted?: boolean;
  data: {
    source: string;
    plate: string;
    hasMultipleVersions: boolean;
    totalVersions: number;
    currentVersionIndex?: number;
    allVersionsProcessed?: boolean;
    availableVersions?: Array<{
      index: number;
      name: string;
      makerId: string;
      modelId: string;
      carId: string;
    }>;
    processedVersions: VehicleVersion[];
    scrapedAt?: string;
    lastUpdatedAt?: string;
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
function normalizeVehicleVersion(plate: string, version: VehicleVersion, source: string) {
  const cleanPlate = plate.toLowerCase();
  
  return {
    plate: cleanPlate,
    source: source,
    title: version.title,
    fullName: version.versionName,
    tipo: version.details.Tipo,
    yearRange: version.details["Año de fabricación (desde - hasta)"],
    bodyType: version.details["Tipo de carrocería"],
    driveType: version.details["Tipo de unidad"],
    powerKw: version.details["Potencia [kW]"],
    powerHp: version.details["Potencia [cv]"],
    displacement: version.details["Cilindrada (cc)"],
    cylinders: version.details.Cilindros,
    valves: version.details["Válvulas para la cámara de combustión"],
    engineType: version.details["Tipo de motor"],
    engineCode: version.details["Código de motor"],
    transmission: version.details.Transmisión,
    fuelType: version.details["Tipo de combustible"],
    fuelPreparation: version.details["Preparación del combustible"],
    brakeSystem: version.details["Sistema de frenos"],
  };
}

// Helper para normalizar datos para guardar en BD
function normalizeVehicleData(response: MatriculaResponse) {
  if (isOscaroFormat(response)) {
    // ... (mantener lógica Oscaro por ahora o adaptarla si es necesario)
    const cleanPlate = response.plate.toLowerCase();
    const { data } = response;
    
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
    // Formato Solvedia/Autodoc - Usamos la primera versión procesada como predeterminada si hay varias
    const { data } = response as MatriculaResponseSolvedia;
    const version = data.processedVersions[0];
    return normalizeVehicleVersion(response.plate, version, data.source);
  }
}

// Helper para construir respuesta normalizada desde caché
function buildResponseFromCache(cachedVehicle: any): MatriculaResponseSolvedia {
  return {
    success: true,
    plate: cachedVehicle.plate,
    timestamp: cachedVehicle.updatedAt.toISOString(),
    hasMultipleVersions: false,
    totalVersions: 1,
    data: {
      source: cachedVehicle.source,
      plate: cachedVehicle.plate,
      hasMultipleVersions: false,
      totalVersions: 1,
      processedVersions: [{
        currentVersionIndex: 0,
        versionName: cachedVehicle.fullName,
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
        }
      }]
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

  // Normalizar matrícula: quitar índice si lo trae y limpiar espacios
  const cleanMatricula = matricula.trim().toLowerCase();
  const baseMatricula = cleanMatricula.includes("-") ? cleanMatricula.split("-")[0] : cleanMatricula;

  // Intentar obtener desde la API externa directamente (que ahora es /cached)
  // Esto asegura que siempre tengamos la lista completa de variaciones actualizada
  try {
    const url = `https://despiezo.solvedia.app/matricula/cached/${baseMatricula}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success) {
        // Guardar/Actualizar en BD local todas las versiones recibidas
        try {
          if (!isOscaroFormat(data)) {
            const solData = data as MatriculaResponseSolvedia;
            const basePlate = solData.plate.toLowerCase();

            // 1. Guardar versiones procesadas (con datos completos)
            const savedIndices = new Set<number>();
            for (let i = 0; i < solData.data.processedVersions.length; i++) {
              const version = solData.data.processedVersions[i];
              const idx = version.currentVersionIndex ?? i;
              const versionPlate = idx === 0 ? basePlate : `${basePlate}-${idx}`;
              const normalizedVersion = normalizeVehicleVersion(versionPlate, version, solData.data.source);
              
              await prisma.vehicle.upsert({
                where: { plate: versionPlate },
                update: normalizedVersion,
                create: normalizedVersion,
              });
              savedIndices.add(idx);
            }

            // 2. Guardar registros stub para availableVersions no procesadas
            //    Esto permite que getVehicleByPlate encuentre todas las variaciones
            if (solData.data.availableVersions) {
              for (const av of solData.data.availableVersions) {
                if (savedIndices.has(av.index)) continue; // ya guardada como procesada
                const versionPlate = av.index === 0 ? basePlate : `${basePlate}-${av.index}`;
                const stubData = {
                  plate: versionPlate,
                  source: solData.data.source || "Autodoc",
                  title: av.name,
                  fullName: av.name,
                  tipo: null,
                  yearRange: null,
                  bodyType: null,
                  driveType: null,
                  powerKw: null,
                  powerHp: null,
                  displacement: null,
                  cylinders: null,
                  valves: null,
                  engineType: null,
                  engineCode: null,
                  transmission: null,
                  fuelType: null,
                  fuelPreparation: null,
                  brakeSystem: null,
                };
                
                // Solo crear si no existe (no sobreescribir datos completos con stub)
                const existing = await prisma.vehicle.findUnique({ where: { plate: versionPlate } });
                if (!existing) {
                  await prisma.vehicle.create({ data: stubData });
                }
              }
            }
          } else {
            const normalizedData = normalizeVehicleData(data);
            await prisma.vehicle.upsert({
              where: { plate: normalizedData.plate },
              update: normalizedData,
              create: normalizedData,
            });
          }
        } catch (dbError) {
          console.error("Error al actualizar caché local:", dbError);
        }

        return data as MatriculaResponse;
      }
    }
  } catch (apiError) {
    console.error("Error consultando API externa, intentando usar caché local:", apiError);
  }

  // 2. Si falla la API, intentar usar caché local (BD) como respaldo
  try {
    const variations = await prisma.vehicle.findMany({
      where: {
        plate: {
          startsWith: baseMatricula,
        },
      },
      orderBy: {
        plate: "asc",
      },
    });

    const exactVariations = variations.filter((v: any) => 
      v.plate === baseMatricula || v.plate.startsWith(`${baseMatricula}-`)
    );

    if (exactVariations.length > 0) {
      const processedVersions: VehicleVersion[] = exactVariations.map((v: any, index: number) => ({
        currentVersionIndex: index,
        versionName: v.fullName,
        title: v.title,
        details: {
          Tipo: v.tipo || "",
          "Año de fabricación (desde - hasta)": v.yearRange || "",
          "Tipo de carrocería": v.bodyType || "",
          "Tipo de unidad": v.driveType || "",
          "Potencia [kW]": v.powerKw || "",
          "Potencia [cv]": v.powerHp || "",
          "Cilindrada (cc)": v.displacement || "",
          Cilindros: v.cylinders || "",
          "Válvulas para la cámara de combustión": v.valves || "",
          "Tipo de motor": v.engineType || "",
          "Código de motor": v.engineCode || "",
          Transmisión: v.transmission || "",
          "Tipo de combustible": v.fuelType || "",
          "Preparación del combustible": v.fuelPreparation || "",
          "Sistema de frenos": v.brakeSystem || "",
        }
      }));

      return {
        success: true,
        plate: baseMatricula,
        timestamp: exactVariations[0].updatedAt.toISOString(),
        hasMultipleVersions: processedVersions.length > 1,
        totalVersions: processedVersions.length,
        data: {
          source: exactVariations[0].source,
          plate: baseMatricula,
          hasMultipleVersions: processedVersions.length > 1,
          totalVersions: processedVersions.length,
          processedVersions: processedVersions,
        },
      } as MatriculaResponseSolvedia;
    }
  } catch (cacheError) {
    console.error("Error al consultar caché local:", cacheError);
  }

  return {
    success: false,
    error: "No se pudo obtener información del vehículo",
  };
}

// Función para obtener datos de vehículo por matrícula desde BD, incluyendo variaciones
export async function getVehicleByPlate(plate: string) {
  try {
    const cleanPlate = plate.toLowerCase();
    const basePlate = cleanPlate.includes("-") ? cleanPlate.split("-")[0] : cleanPlate;
    const hasIndexSuffix = cleanPlate.includes("-");

    // Buscar todas las variaciones de esta matrícula
    let variations = await prisma.vehicle.findMany({
      where: {
        plate: {
          startsWith: basePlate,
        },
      },
      orderBy: {
        plate: "asc",
      },
    });

    // Filtrar para asegurarnos que solo coincidan con "basePlate" o "basePlate-index"
    let exactVariations = variations.filter((v: any) => 
      v.plate === basePlate || v.plate.startsWith(`${basePlate}-`)
    );

    // Si la placa tiene índice (ej: "3588jvz-1") pero solo encontramos 1 variación en BD,
    // significa que faltan registros. Refrescamos el caché llamando a searchByMatricula.
    if (exactVariations.length <= 1 && hasIndexSuffix) {
      try {
        await searchByMatricula(basePlate);
        // Re-consultar después del refresh
        variations = await prisma.vehicle.findMany({
          where: { plate: { startsWith: basePlate } },
          orderBy: { plate: "asc" },
        });
        exactVariations = variations.filter((v: any) => 
          v.plate === basePlate || v.plate.startsWith(`${basePlate}-`)
        );
      } catch (refreshError) {
        console.error("Error al refrescar caché de variaciones:", refreshError);
      }
    }

    if (exactVariations.length === 0) return null;

    // Encontrar el vehículo específico solicitado
    const vehicle = exactVariations.find((v: any) => v.plate === cleanPlate) || exactVariations[0];

    return {
      ...vehicle,
      availableVariations: exactVariations.map((v: any, index: number) => ({
        plate: v.plate,
        fullName: v.fullName,
        yearRange: v.yearRange,
        index: index
      }))
    };
  } catch (error) {
    console.error("Error en getVehicleByPlate:", error);
    return null;
  }
}
