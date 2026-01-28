-- Crear tabla OemPieza para almacenar piezas por OEM
CREATE TABLE IF NOT EXISTS "OemPieza" (
    "id" TEXT NOT NULL,
    "oem" TEXT NOT NULL,
    "site" TEXT,
    "name" TEXT,
    "price" TEXT,
    "priceEUR" TEXT,
    "url" TEXT,
    "features" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OemPieza_pkey" PRIMARY KEY ("id")
);

-- Crear índice único para OEM
CREATE UNIQUE INDEX IF NOT EXISTS "OemPieza_oem_key" ON "OemPieza"("oem");

-- Crear índice para búsquedas por OEM
CREATE INDEX IF NOT EXISTS "OemPieza_oem_idx" ON "OemPieza"("oem");

-- Crear tabla OemCompatibilidad para almacenar compatibilidades de cada pieza
CREATE TABLE IF NOT EXISTS "OemCompatibilidad" (
    "id" TEXT NOT NULL,
    "oemPiezaId" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "anio" TEXT,
    "variante" TEXT,
    "tipo" TEXT,
    "chasis" TEXT,
    "motor" TEXT,
    "atributosExtra" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OemCompatibilidad_pkey" PRIMARY KEY ("id")
);

-- Crear índices para OemCompatibilidad
CREATE INDEX IF NOT EXISTS "OemCompatibilidad_oemPiezaId_idx" ON "OemCompatibilidad"("oemPiezaId");
CREATE INDEX IF NOT EXISTS "OemCompatibilidad_marca_idx" ON "OemCompatibilidad"("marca");
CREATE INDEX IF NOT EXISTS "OemCompatibilidad_modelo_idx" ON "OemCompatibilidad"("modelo");
CREATE INDEX IF NOT EXISTS "OemCompatibilidad_anio_idx" ON "OemCompatibilidad"("anio");

-- Crear foreign key constraint
ALTER TABLE "OemCompatibilidad" 
ADD CONSTRAINT "OemCompatibilidad_oemPiezaId_fkey" 
FOREIGN KEY ("oemPiezaId") REFERENCES "OemPieza"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Función para actualizar updatedAt automáticamente
CREATE OR REPLACE FUNCTION update_oem_pieza_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updatedAt en OemPieza
DROP TRIGGER IF EXISTS update_oem_pieza_updated_at_trigger ON "OemPieza";
CREATE TRIGGER update_oem_pieza_updated_at_trigger
BEFORE UPDATE ON "OemPieza"
FOR EACH ROW
EXECUTE FUNCTION update_oem_pieza_updated_at();
