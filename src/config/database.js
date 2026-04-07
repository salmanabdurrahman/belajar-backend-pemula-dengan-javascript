import pg from 'pg';
import config from './env.js';

const { Pool } = pg;

const pool = new Pool({
  user: config.pgUser,
  password: config.pgPassword,
  host: config.pgHost,
  port: config.pgPort,
  database: config.pgDatabase,
});

pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
});

export default pool;
