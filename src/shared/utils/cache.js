import getRedisClient from '../libs/redis.js';
import logger from '../../config/logger.js';

const defaultTtlSeconds = 60 * 60;
const memoryCache = new Map();

const getMemoryCache = (key) => {
  const cached = memoryCache.get(key);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return cached.value;
};

const setMemoryCache = (key, value, ttlSeconds) => {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

const deleteMemoryCache = (keys) => {
  keys.forEach((key) => {
    memoryCache.delete(key);
  });
};

class CacheService {
  async get(key) {
    const redisClient = await getRedisClient();

    if (redisClient?.isOpen) {
      try {
        const value = await redisClient.get(key);
        if (!value) {
          return null;
        }

        return JSON.parse(value);
      } catch (error) {
        logger.warn('Failed to read cache from Redis, using fallback cache', {
          key,
          message: error.message,
        });
      }
    }

    return getMemoryCache(key);
  }

  async set(key, value, ttlSeconds = defaultTtlSeconds) {
    const redisClient = await getRedisClient();

    if (redisClient?.isOpen) {
      try {
        await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
        return;
      } catch (error) {
        logger.warn('Failed to write cache to Redis, using fallback cache', {
          key,
          message: error.message,
        });
      }
    }

    setMemoryCache(key, value, ttlSeconds);
  }

  async del(...keys) {
    const cleanedKeys = keys.filter(Boolean);
    if (cleanedKeys.length === 0) {
      return;
    }

    const redisClient = await getRedisClient();
    if (redisClient?.isOpen) {
      try {
        await redisClient.del(cleanedKeys);
      } catch (error) {
        logger.warn('Failed to delete Redis cache key(s)', {
          keys: cleanedKeys,
          message: error.message,
        });
      }
    }

    deleteMemoryCache(cleanedKeys);
  }
}

export { defaultTtlSeconds };
export default new CacheService();
