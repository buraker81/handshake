import { z } from "zod";

export const apiEnvSchema = z.object({
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CHAIN_ID: z.coerce.number().default(43113), // Avalanche Fuji testnet
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export function validateApiEnv(env: Record<string, string | undefined> = process.env): ApiEnv {
  const result = apiEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("Invalid API environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data as ApiEnv;
}
