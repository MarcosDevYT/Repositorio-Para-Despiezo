# API de Alimentador de Matrículas

Documentación de endpoints públicos para gestionar datos de vehículos cacheados en la plataforma.

## Base URL

```
http://localhost:3000/api/vehicles
```

En producción:
```
https://tu-dominio.com/api/vehicles
```

---

## Endpoints Disponibles

### 1. Obtener Listado de Vehículos

**GET** `/api/vehicles`

Obtiene el listado de todos los vehículos que tienen datos cacheados en la plataforma.

#### Parámetros de Query (Opcionales)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `limit` | number | Cantidad de resultados por página (default: 100) | `?limit=50` |
| `offset` | number | Número de registros a saltar (default: 0) | `?offset=100` |
| `minParams` | number | Filtrar vehículos con al menos N parámetros | `?minParams=5` |
| `maxParams` | number | Filtrar vehículos con máximo N parámetros | `?maxParams=4` |

#### Ejemplos de Uso

**Obtener todos los vehículos (primeros 100):**
```bash
GET /api/vehicles
```

**Obtener vehículos con paginación:**
```bash
GET /api/vehicles?limit=50&offset=0
```

**Obtener vehículos con 5 o más parámetros:**
```bash
GET /api/vehicles?minParams=5
```

**Obtener vehículos con 4 parámetros o menos:**
```bash
GET /api/vehicles?maxParams=4
```

**Obtener vehículos con entre 5 y 10 parámetros:**
```bash
GET /api/vehicles?minParams=5&maxParams=10
```

**Combinar filtros con paginación:**
```bash
GET /api/vehicles?minParams=5&limit=20&offset=40
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "total": 250,
  "count": 50,
  "limit": 50,
  "offset": 0,
  "vehicles": [
    {
      "plate": "1234abc",
      "source": "Autodoc",
      "title": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2)",
      "fullName": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2) 2.0 TDI",
      "tipo": "Turismo",
      "yearRange": "2012 - ...",
      "bodyType": "Hatchback",
      "driveType": "Tracción delantera",
      "powerKw": "110 kW",
      "powerHp": "150 cv",
      "displacement": "1968 cc",
      "cylinders": "4",
      "valves": "16",
      "engineType": "Motor diesel",
      "engineCode": "CUNA",
      "transmission": "Manual",
      "fuelType": "Diesel",
      "fuelPreparation": "Inyección directa Common Rail",
      "brakeSystem": "Sistema de frenos hidráulico",
      "createdAt": "2026-01-26T08:15:30.000Z",
      "updatedAt": "2026-01-26T08:15:30.000Z"
    },
    {
      "plate": "5678xyz",
      "source": "Oscaro",
      "title": "SEAT LEON III",
      "fullName": "SEAT LEON III 2.0 TDI BlueMotion 150 cv",
      "tipo": null,
      "yearRange": null,
      "bodyType": null,
      "driveType": null,
      "powerKw": null,
      "powerHp": "150 cv",
      "displacement": "2.0L",
      "cylinders": null,
      "valves": null,
      "engineType": null,
      "engineCode": null,
      "transmission": null,
      "fuelType": "Diesel",
      "fuelPreparation": null,
      "brakeSystem": null,
      "createdAt": "2026-01-25T14:22:10.000Z",
      "updatedAt": "2026-01-25T14:22:10.000Z"
    }
  ]
}
```

#### Respuesta de Error (500)

```json
{
  "success": false,
  "error": "Error al obtener vehículos"
}
```

---

### 2. Obtener Datos de un Vehículo Específico

**GET** `/api/vehicles/{plate}`

Obtiene los datos completos de un vehículo específico por su matrícula.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `plate` | string | Matrícula del vehículo (case-insensitive) | `1234ABC` |

#### Ejemplo de Uso

```bash
GET /api/vehicles/1234abc
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "vehicle": {
    "plate": "1234abc",
    "source": "Autodoc",
    "title": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2)",
    "fullName": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2) 2.0 TDI",
    "tipo": "Turismo",
    "yearRange": "2012 - ...",
    "bodyType": "Hatchback",
    "driveType": "Tracción delantera",
    "powerKw": "110 kW",
    "powerHp": "150 cv",
    "displacement": "1968 cc",
    "cylinders": "4",
    "valves": "16",
    "engineType": "Motor diesel",
    "engineCode": "CUNA",
    "transmission": "Manual",
    "fuelType": "Diesel",
    "fuelPreparation": "Inyección directa Common Rail",
    "brakeSystem": "Sistema de frenos hidráulico",
    "createdAt": "2026-01-26T08:15:30.000Z",
    "updatedAt": "2026-01-26T08:15:30.000Z"
  }
}
```

#### Respuesta de Error (404 Not Found)

```json
{
  "success": false,
  "error": "Vehículo no encontrado"
}
```

#### Respuesta de Error (400 Bad Request)

```json
{
  "success": false,
  "error": "La matrícula es requerida"
}
```

---

### 3. Crear o Actualizar Datos de un Vehículo

**POST** `/api/vehicles/{plate}`

Crea un nuevo vehículo o actualiza los datos de uno existente (upsert).

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `plate` | string | Matrícula del vehículo (case-insensitive) | `1234ABC` |

#### Body (JSON)

**Campos Requeridos:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `source` | string | Fuente de los datos (ej: "Autodoc", "Oscaro") |
| `title` | string | Título del vehículo |
| `fullName` | string | Nombre completo del vehículo |

**Campos Opcionales:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `tipo` | string | Tipo de vehículo (ej: "Turismo") |
| `yearRange` | string | Rango de años (ej: "2012 - ...") |
| `bodyType` | string | Tipo de carrocería (ej: "Hatchback") |
| `driveType` | string | Tipo de tracción (ej: "Tracción delantera") |
| `powerKw` | string | Potencia en kW (ej: "110 kW") |
| `powerHp` | string | Potencia en cv (ej: "150 cv") |
| `displacement` | string | Cilindrada (ej: "1968 cc") |
| `cylinders` | string | Número de cilindros (ej: "4") |
| `valves` | string | Número de válvulas (ej: "16") |
| `engineType` | string | Tipo de motor (ej: "Motor diesel") |
| `engineCode` | string | Código del motor (ej: "CUNA") |
| `transmission` | string | Tipo de transmisión (ej: "Manual") |
| `fuelType` | string | Tipo de combustible (ej: "Diesel") |
| `fuelPreparation` | string | Preparación del combustible |
| `brakeSystem` | string | Sistema de frenos |

#### Ejemplo de Uso - Crear/Actualizar con Todos los Parámetros

```bash
POST /api/vehicles/1234abc
Content-Type: application/json

{
  "source": "Autodoc",
  "title": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2)",
  "fullName": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2) 2.0 TDI",
  "tipo": "Turismo",
  "yearRange": "2012 - ...",
  "bodyType": "Hatchback",
  "driveType": "Tracción delantera",
  "powerKw": "110 kW",
  "powerHp": "150 cv",
  "displacement": "1968 cc",
  "cylinders": "4",
  "valves": "16",
  "engineType": "Motor diesel",
  "engineCode": "CUNA",
  "transmission": "Manual",
  "fuelType": "Diesel",
  "fuelPreparation": "Inyección directa Common Rail",
  "brakeSystem": "Sistema de frenos hidráulico"
}
```

#### Ejemplo de Uso - Crear/Actualizar con Parámetros Mínimos

```bash
POST /api/vehicles/5678xyz
Content-Type: application/json

{
  "source": "Oscaro",
  "title": "SEAT LEON III",
  "fullName": "SEAT LEON III 2.0 TDI BlueMotion 150 cv",
  "powerHp": "150 cv",
  "displacement": "2.0L",
  "fuelType": "Diesel"
}
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Vehículo guardado correctamente",
  "vehicle": {
    "plate": "1234abc",
    "source": "Autodoc",
    "title": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2)",
    "fullName": "VOLKSWAGEN GOLF VII (5G1, BQ1, BE1, BE2) 2.0 TDI",
    "tipo": "Turismo",
    "yearRange": "2012 - ...",
    "bodyType": "Hatchback",
    "driveType": "Tracción delantera",
    "powerKw": "110 kW",
    "powerHp": "150 cv",
    "displacement": "1968 cc",
    "cylinders": "4",
    "valves": "16",
    "engineType": "Motor diesel",
    "engineCode": "CUNA",
    "transmission": "Manual",
    "fuelType": "Diesel",
    "fuelPreparation": "Inyección directa Common Rail",
    "brakeSystem": "Sistema de frenos hidráulico",
    "createdAt": "2026-01-26T08:15:30.000Z",
    "updatedAt": "2026-01-26T08:20:45.000Z"
  }
}
```

#### Respuesta de Error (400 Bad Request)

```json
{
  "success": false,
  "error": "Los campos source, title y fullName son requeridos"
}
```

#### Respuesta de Error (500)

```json
{
  "success": false,
  "error": "Error al guardar vehículo"
}
```

---

## Ejemplos de Integración

### JavaScript/Node.js (fetch)

```javascript
// Obtener listado de vehículos con 5+ parámetros
async function getVehiclesWithManyParams() {
  const response = await fetch('http://localhost:3000/api/vehicles?minParams=5&limit=50');
  const data = await response.json();
  
  if (data.success) {
    console.log(`Total de vehículos: ${data.total}`);
    console.log(`Vehículos obtenidos: ${data.count}`);
    data.vehicles.forEach(vehicle => {
      console.log(`${vehicle.plate} - ${vehicle.fullName}`);
    });
  }
}

// Obtener datos de un vehículo específico
async function getVehicleByPlate(plate) {
  const response = await fetch(`http://localhost:3000/api/vehicles/${plate}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('Vehículo encontrado:', data.vehicle);
  } else {
    console.error('Error:', data.error);
  }
}

// Crear o actualizar un vehículo
async function upsertVehicle(plate, vehicleData) {
  const response = await fetch(`http://localhost:3000/api/vehicles/${plate}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicleData),
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Vehículo guardado:', data.vehicle);
  } else {
    console.error('Error:', data.error);
  }
}

// Ejemplo de uso
getVehiclesWithManyParams();
getVehicleByPlate('1234abc');
upsertVehicle('9999zzz', {
  source: 'Autodoc',
  title: 'BMW Serie 3',
  fullName: 'BMW Serie 3 (F30) 320d',
  powerHp: '184 cv',
  fuelType: 'Diesel',
});
```

### Python (requests)

```python
import requests

BASE_URL = 'http://localhost:3000/api/vehicles'

# Obtener listado de vehículos con 4 o menos parámetros
def get_vehicles_with_few_params():
    response = requests.get(f'{BASE_URL}?maxParams=4&limit=100')
    data = response.json()
    
    if data['success']:
        print(f"Total de vehículos: {data['total']}")
        print(f"Vehículos obtenidos: {data['count']}")
        for vehicle in data['vehicles']:
            print(f"{vehicle['plate']} - {vehicle['fullName']}")

# Obtener datos de un vehículo específico
def get_vehicle_by_plate(plate):
    response = requests.get(f'{BASE_URL}/{plate}')
    data = response.json()
    
    if data['success']:
        print('Vehículo encontrado:', data['vehicle'])
    else:
        print('Error:', data['error'])

# Crear o actualizar un vehículo
def upsert_vehicle(plate, vehicle_data):
    response = requests.post(
        f'{BASE_URL}/{plate}',
        json=vehicle_data
    )
    data = response.json()
    
    if data['success']:
        print('Vehículo guardado:', data['vehicle'])
    else:
        print('Error:', data['error'])

# Ejemplo de uso
get_vehicles_with_few_params()
get_vehicle_by_plate('1234abc')
upsert_vehicle('9999zzz', {
    'source': 'Autodoc',
    'title': 'BMW Serie 3',
    'fullName': 'BMW Serie 3 (F30) 320d',
    'powerHp': '184 cv',
    'fuelType': 'Diesel',
})
```

### cURL

```bash
# Obtener listado de vehículos
curl "http://localhost:3000/api/vehicles?limit=50"

# Obtener vehículos con 5+ parámetros
curl "http://localhost:3000/api/vehicles?minParams=5"

# Obtener vehículos con 4 o menos parámetros
curl "http://localhost:3000/api/vehicles?maxParams=4"

# Obtener un vehículo específico
curl "http://localhost:3000/api/vehicles/1234abc"

# Crear o actualizar un vehículo
curl -X POST "http://localhost:3000/api/vehicles/1234abc" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Autodoc",
    "title": "VOLKSWAGEN GOLF VII",
    "fullName": "VOLKSWAGEN GOLF VII 2.0 TDI",
    "powerHp": "150 cv",
    "fuelType": "Diesel"
  }'
```

---

## Notas Importantes

### Conteo de Parámetros

Los parámetros contados para los filtros `minParams` y `maxParams` son:

1. tipo
2. yearRange
3. bodyType
4. driveType
5. powerKw
6. powerHp
7. displacement
8. cylinders
9. valves
10. engineType
11. engineCode
12. transmission
13. fuelType
14. fuelPreparation
15. brakeSystem

**No se cuentan:** `id`, `plate`, `source`, `title`, `fullName`, `createdAt`, `updatedAt`

### Matrículas

- Las matrículas son **case-insensitive** (se convierten automáticamente a minúsculas)
- Las matrículas son **únicas** en el sistema
- Al actualizar, se usa la matrícula como identificador único

### Paginación

- El `limit` por defecto es **100 registros**
- El `offset` por defecto es **0**
- Para paginar: `offset = página * limit`

### Upsert

El endpoint POST realiza un **upsert**:
- Si la matrícula **no existe**, crea un nuevo registro
- Si la matrícula **ya existe**, actualiza el registro existente
- Siempre actualiza el campo `updatedAt` automáticamente

---

## Casos de Uso del Servicio Externo

### 1. Sincronización Periódica

El servicio externo puede ejecutarse cada X minutos/horas para:

1. Obtener vehículos con pocos parámetros (`maxParams=4`)
2. Consultar APIs externas para enriquecer los datos
3. Actualizar los registros con POST

```javascript
// Ejemplo de proceso de sincronización
async function syncVehicles() {
  // 1. Obtener vehículos con datos incompletos
  const response = await fetch('http://localhost:3000/api/vehicles?maxParams=4&limit=100');
  const { vehicles } = await response.json();
  
  // 2. Para cada vehículo, enriquecer datos
  for (const vehicle of vehicles) {
    const enrichedData = await fetchExternalAPI(vehicle.plate);
    
    // 3. Actualizar el vehículo
    await fetch(`http://localhost:3000/api/vehicles/${vehicle.plate}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...vehicle,
        ...enrichedData,
      }),
    });
  }
}
```

### 2. Alimentación de Nuevas Matrículas

Cuando el servicio externo obtiene datos de una nueva matrícula:

```javascript
async function feedNewVehicle(plate, externalData) {
  await fetch(`http://localhost:3000/api/vehicles/${plate}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: externalData.source,
      title: externalData.title,
      fullName: externalData.fullName,
      // ... resto de parámetros
    }),
  });
}
```

### 3. Monitoreo de Calidad de Datos

Obtener estadísticas sobre la calidad de los datos cacheados:

```javascript
async function getDataQualityStats() {
  const [complete, incomplete] = await Promise.all([
    fetch('http://localhost:3000/api/vehicles?minParams=10').then(r => r.json()),
    fetch('http://localhost:3000/api/vehicles?maxParams=4').then(r => r.json()),
  ]);
  
  console.log(`Vehículos completos (10+ params): ${complete.total}`);
  console.log(`Vehículos incompletos (≤4 params): ${incomplete.total}`);
}
```

---

## Seguridad

⚠️ **IMPORTANTE:** Estos endpoints son **públicos** y no requieren autenticación. 

Para uso en producción, considera:
- Implementar rate limiting
- Añadir API keys o tokens de autenticación
- Validar IPs permitidas
- Monitorear uso y abusos
