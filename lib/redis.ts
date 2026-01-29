import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const redis = new Redis(redisUrl!, {
  maxRetriesPerRequest: 2,
  retryStrategy(times) {
    if (times > 2) {
      console.warn(`[Redis] Máximo de reintentos alcanzado (${times}). Deteniendo reintentos.`);
      return null; // Deja de intentar conectar
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

redis.on("error", (error) => {
  // Capturamos el error para que no sea un "Unhandled error event"
  console.error("[Redis] Error de conexión:", error.message);
});
