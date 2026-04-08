import { createClient } from 'redis';
import config from '../../config/env.js';
import logger from '../../config/logger.js';

let redisClient = null;
let redisClientPromise = null;
let lastConnectionErrorAt = 0;
const reconnectIntervalMs = 5000;

const createRedisConnection = async () => {
  const options = {
    socket: {
      host: config.redisHost,
      port: config.redisPort,
    },
  };

  if (config.redisPassword) {
    options.password = config.redisPassword;
  }

  const client = createClient(options);

  client.on('error', (error) => {
    logger.warn('Redis client error', { message: error.message });
  });

  client.on('end', () => {
    logger.warn('Redis connection closed');
  });

  await client.connect();
  logger.info('Redis connected');

  return client;
};

const getRedisClient = async () => {
  if (!config.redisHost) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (Date.now() - lastConnectionErrorAt < reconnectIntervalMs) {
    return null;
  }

  if (!redisClientPromise) {
    redisClientPromise = createRedisConnection()
      .then((client) => {
        redisClient = client;
        lastConnectionErrorAt = 0;
        return redisClient;
      })
      .catch((error) => {
        logger.warn('Redis is unavailable, using fallback cache', {
          message: error.message,
        });
        lastConnectionErrorAt = Date.now();
        redisClient = null;
        return null;
      })
      .finally(() => {
        redisClientPromise = null;
      });
  }

  return redisClientPromise;
};

export default getRedisClient;
