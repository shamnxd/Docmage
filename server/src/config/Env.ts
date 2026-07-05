import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();
const envSchema = z.object({
  PORT: z.preprocess((val) => Number(val) || 5000, z.number().default(5000)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_REGION: z.string(),
  S3_BUCKET_NAME: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  OTP_EXPIRY_SECONDS: z.preprocess((val) => Number(val) || 300, z.number().default(300)),
  REFRESH_TOKEN_MAX_AGE_MS: z.preprocess((val) => Number(val) || 604_800_000, z.number().default(604_800_000)), 
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables configuration');
}
export const env = parsedEnv.data;