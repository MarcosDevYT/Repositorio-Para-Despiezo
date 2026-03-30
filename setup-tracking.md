# Configuración del Sistema de Tracking OEM

## Pasos para activar el sistema

### 1. Detener el servidor de desarrollo
Presiona `Ctrl+C` en la terminal donde está corriendo `npm run dev`

### 2. Ejecutar la migración de Prisma
```bash
npx prisma migrate dev --name add_oem_compatibility_tracker
```

Si te pide un nombre para la migración, usa: `add_oem_compatibility_tracker`

### 3. Generar el cliente de Prisma
```bash
npx prisma generate
```

Si el paso anterior falla por permisos, cierra VSCode/Windsurf completamente y vuelve a abrirlo, luego ejecuta:
```bash
npx prisma generate
```

### 4. Iniciar el servidor
```bash
npm run dev
```

### 5. Sincronizar productos existentes
1. Ve a `http://localhost:3000/tools/compatibilidad`
2. Ingresa la clave de acceso: `catalogosecreto`
3. Haz clic en el tab "Tracking Productos"
4. Haz clic en el botón "Sincronizar Productos"

Esto registrará todos los productos que tienen OEM en el sistema de tracking.

## Verificación

Después de la sincronización, deberías ver:
- **Total Productos**: Número de productos con OEM registrados
- **Sin Compatibilidades**: Productos que aún no tienen datos de compatibilidad
- **Con Compatibilidades**: Productos que ya tienen compatibilidades cargadas

## Funcionamiento Automático

Una vez configurado, el sistema funciona automáticamente:
- Cuando un usuario visita un producto sin compatibilidades, se registra en el tracking
- El sistema consulta automáticamente la API externa para obtener compatibilidades
- Cuando se obtienen compatibilidades, el estado se actualiza automáticamente
