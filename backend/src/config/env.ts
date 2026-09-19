import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), '.env'),
];
for (const envPath of envCandidates) {
  dotenv.config({ path: envPath });
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required.' }).min(1),
  JWT_SECRET: z.string().min(16).default('super-secret-jwt-key-for-development-change-in-production-12345'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(16).default('super-secret-refresh-jwt-key-for-development-change-in-prod-67890'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ENCRYPTION_KEY: z.string().min(16).default('c0ffee1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  LIVE_SECRET_KEY: z.string().optional(),
  LIVE_PUBLIC_KEY: z.string().optional(),
  TEST_SECRET_KEY: z.string().optional(),
  TEST_PUBLIC_KEY: z.string().optional(),
  PAYMONGO_WEBHOOK_SIGNING_SECRET: z.string().optional(),
  PAYMONGO_WEBHOOK_ID: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;
