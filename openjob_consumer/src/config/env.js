import 'dotenv/config.js';

const config = {
  pgUser: process.env.PGUSER || 'postgres',
  pgPassword: process.env.PGPASSWORD || '',
  pgDatabase: process.env.PGDATABASE || 'openjob_db',
  pgHost: process.env.PGHOST || 'localhost',
  pgPort: Number(process.env.PGPORT) || 5432,
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
