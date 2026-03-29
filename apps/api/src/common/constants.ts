export const AUTH_CONSTANTS = {
  NONCE_TTL_MS: 10 * 60 * 1000, // 10 minutes
  SESSION_TTL_MS: 24 * 60 * 60 * 1000, // 24 hours
  COOKIE_NAME: "sid",
  COOKIE_MAX_AGE_MS: 24 * 60 * 60 * 1000,
} as const;
