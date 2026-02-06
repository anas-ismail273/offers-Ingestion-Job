import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Database Connection
 * This is the connection object for the PostgreSQL database.
 */
export const db = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
