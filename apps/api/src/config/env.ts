import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'node:path';

// Load .env from current directory or root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_URL: z.string().url().default('http://localhost:4000'),
  WEB_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z
    .string()
    .default(
      process.env.NODE_ENV === 'test'
        ? 'postgresql://housie_user:housie_password@localhost:5432/housie_db?schema=public'
        : ''
    ),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long')
    .default(
      process.env.NODE_ENV === 'test'
        ? 'super-secret-test-jwt-secret-at-least-32-chars-long'
        : ''
    ),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRATION_DAYS: z.coerce.number().int().positive().default(7),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SECURE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

export function getEnv(): Env {
  if (!parsedEnv) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error('❌ Invalid environment variables configuration:');
      console.error(JSON.stringify(result.error.format(), null, 2));
      throw new Error('Environment configuration validation failed');
    }
    parsedEnv = result.data;
  }
  return parsedEnv;
}

export const env = getEnv();
