import 'dotenv/config.js';

const config = {
  pgUser: process.env.PGUSER || 'postgres',
  pgPassword: process.env.PGPASSWORD || '',
  pgDatabase: process.env.PGDATABASE || 'openjob_db',
  pgHost: process.env.PGHOST || 'localhost',
  pgPort: process.env.PGPORT || 5432,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
