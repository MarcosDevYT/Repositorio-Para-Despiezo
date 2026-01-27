-- Migración manual para crear tabla Vehicle
-- Ejecuta este SQL directamente en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS "Vehicle" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "tipo" TEXT,
    "yearRange" TEXT,
    "bodyType" TEXT,
    "driveType" TEXT,
    "powerKw" TEXT,
    "powerHp" TEXT,
    "displacement" TEXT,
    "cylinders" TEXT,
    "valves" TEXT,
    "engineType" TEXT,
    "engineCode" TEXT,
    "transmission" TEXT,
    "fuelType" TEXT,
    "fuelPreparation" TEXT,
    "brakeSystem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- Crear índice único en plate
CREATE UNIQUE INDEX IF NOT EXISTS "Vehicle_plate_key" ON "Vehicle"("plate");

-- Crear índice adicional para búsquedas rápidas
CREATE INDEX IF NOT EXISTS "Vehicle_plate_idx" ON "Vehicle"("plate");

-- Comentario informativo
COMMENT ON TABLE "Vehicle" IS 'Tabla caché para almacenar datos de vehículos consultados por matrícula';
