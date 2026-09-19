import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { ENV } from './env.js';
import type { Database } from '../types/database.js';

const { Pool, types } = pg;

// Parse PostgreSQL DATE (OID 1082) as plain 'YYYY-MM-DD' string instead of JavaScript Date to avoid UTC timezone shifts
types.setTypeParser(1082, (val: string) => val);

// Sanitize any invalid PGPORT environment variable to prevent NaN errors
if (process.env.PGPORT && isNaN(parseInt(process.env.PGPORT, 10))) {
  delete process.env.PGPORT;
}

const normalizeDatabaseUrl = (urlStr: string): string => {
  try {
    const parsed = new URL(urlStr);
    if (!parsed.port) {
      parsed.port = '5432';
    }
    return parsed.toString();
  } catch {
    return urlStr;
  }
};

const shouldUseSsl = (databaseUrl: string): boolean | { rejectUnauthorized: boolean } => {
  if (process.env.DATABASE_SSL === 'true' || process.env.PGSSLMODE === 'require') {
    return { rejectUnauthorized: false };
  }
  if (process.env.DATABASE_SSL === 'false' || process.env.PGSSLMODE === 'disable') {
    return false;
  }
  try {
    const parsed = new URL(databaseUrl);
    const sslmode = parsed.searchParams.get('sslmode');
    const ssl = parsed.searchParams.get('ssl');
    if (ssl === 'true' || (sslmode && sslmode !== 'disable')) {
      return { rejectUnauthorized: false };
    }
    const hostname = parsed.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === 'postgres' ||
      hostname === 'host.docker.internal' ||
      !hostname.includes('.')
    ) {
      return false;
    }
    return { rejectUnauthorized: false };
  } catch {
    return false;
  }
};

const normalizedDatabaseUrl = normalizeDatabaseUrl(ENV.DATABASE_URL);

const defaultMaxConnections = ENV.NODE_ENV === 'production' ? 10 : 20;
const poolMax = process.env.DB_POOL_MAX
  ? parseInt(process.env.DB_POOL_MAX, 10)
  : defaultMaxConnections;

export const pool = new Pool({
  connectionString: normalizedDatabaseUrl,
  max: poolMax, // Max concurrent client connections in pool (tuned for serverless/production)
  idleTimeoutMillis: 10000, // Close idle clients after 10s
  connectionTimeoutMillis: 5000, // Return an error after 5s if connection cannot be established
  ssl: shouldUseSsl(normalizedDatabaseUrl),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool,
  }),
});
