import { z } from "zod";

export const webEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
