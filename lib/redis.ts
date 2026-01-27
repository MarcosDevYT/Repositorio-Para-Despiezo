import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

// Crea una instancia de Redis con manejo de errores
function createRedisClient(): Redis {
  if (!REDIS_URL) {
    console.warn("[Redis] REDIS_URL no está configurada. Usando cliente mock.");
    // Retorna un cliente que no hace nada si no hay URL configurada
    return createMockRedisClient();
  }

  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      // Reintentar hasta 3 veces con delay exponencial
      if (times > 3) {
        console.warn("[Redis] Máximo de reintentos alcanzado. Desconectando.");
        return null; // Deja de reintentar
      }
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
    lazyConnect: true, // No conectar inmediatamente
    enableOfflineQueue: false, // No encolar comandos si está desconectado
  });

  // Manejo de eventos de conexión
  client.on("connect", () => {
    console.log("[Redis] Conectado exitosamente");
  });

  client.on("error", (error) => {
    console.warn("[Redis] Error de conexión:", error.message);
  });

  client.on("close", () => {
    console.log("[Redis] Conexión cerrada");
  });

  return client;
}

// Cliente mock para cuando Redis no está disponible
function createMockRedisClient(): Redis {
  const mockClient = {
    get: async () => null,
    set: async () => "OK",
    del: async () => 0,
    exists: async () => 0,
    expire: async () => 0,
    ttl: async () => -1,
    ping: async () => "PONG",
    quit: async () => "OK",
    disconnect: () => {},
    on: () => mockClient,
    // Agregar más métodos según sea necesario
  } as unknown as Redis;

  return mockClient;
}

// Singleton del cliente Redis
export const redis = createRedisClient();

/**
 * Verifica si la conexión a Redis está activa
 * @returns true si Redis responde correctamente, false en caso contrario
 */
export async function isRedisConnected(): Promise<boolean> {
  try {
    const pong = await redis.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}

/**
 * Intenta conectar a Redis de forma segura
 * @returns true si la conexión fue exitosa, false en caso contrario
 */
export async function connectRedis(): Promise<boolean> {
  try {
    if (!REDIS_URL) {
      console.warn("[Redis] No se puede conectar: REDIS_URL no configurada");
      return false;
    }
    await redis.connect();
    return true;
  } catch (error) {
    console.warn("[Redis] Error al conectar:", error);
    return false;
  }
}
