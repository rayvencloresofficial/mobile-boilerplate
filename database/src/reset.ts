import { fileURLToPath } from 'url';
import { runMigrations } from './migrate.js';
import { runSeeds } from './seed.js';
import { createPool, ensureDatabaseExists } from './client.js';

export async function resetDatabase(): Promise<void> {
  console.log('🔄 Running complete database reset (drop + migrate + seed)...');
  await ensureDatabaseExists();
  const pool = createPool();
  const client = await pool.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('🧹 Cleaned and reset database schema.');
  } finally {
    client.release();
    await pool.end();
  }

  await runMigrations();
  await runSeeds();
  console.log('✨ Complete database setup finished!\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  resetDatabase();
}
