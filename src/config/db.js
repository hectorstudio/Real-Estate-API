import { Pool } from 'pg';

require('dotenv').config();

// TODO: Include database URL in env variables for prod environemnt
const isProduction = false; // process.env.NODE_ENV === 'production';

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

export const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: true,
});
