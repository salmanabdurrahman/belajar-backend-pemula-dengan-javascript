import 'dotenv/config.js';

const config = {
  pgUser: process.env.PGUSER || 'postgres',
  pgPassword: process.env.PGPASSWORD || '',
  pgDatabase: process.env.PGDATABASE || 'openjob_db',
  pgHost: process.env.PGHOST || 'localhost',
  pgPort: Number(process.env.PGPORT) || 5432,
  host: process.env.HOST || 'localhost',
  port: Number(process.env.PORT) || 3000,
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisPassword: process.env.REDIS_PASSWORD || '',
  rabbitMqHost: process.env.RABBITMQ_HOST || 'localhost',
  rabbitMqPort: Number(process.env.RABBITMQ_PORT) || 5672,
  rabbitMqUser: process.env.RABBITMQ_USER || '',
  rabbitMqPassword: process.env.RABBITMQ_PASSWORD || '',
  mailHost: process.env.MAIL_HOST || '',
  mailPort: Number(process.env.MAIL_PORT) || 587,
  mailUser: process.env.MAIL_USER || '',
  mailPassword: process.env.MAIL_PASSWORD || '',
  mailFromAddress: process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USER || '',
  mailFromName: process.env.MAIL_FROM_NAME || 'OpenJob',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
