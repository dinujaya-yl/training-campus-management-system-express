// src/config.ts
import dotenv from "dotenv";
import "dotenv/config"; 
import { z } from "zod";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
  JWT_SECRET: z.string().min(32),
  DATABASE_LOCAL: z.string().url(),
  REDIS_HOST: z.string().default('redis'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const config = parsed.data;

export default config;