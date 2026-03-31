export const AUTH_CONSTANTS = {
  NONCE_TTL_MS: 10 * 60 * 1000, // 10 minutes
  SESSION_TTL_MS: 24 * 60 * 60 * 1000, // 24 hours
  COOKIE_NAME: "sid",
  COOKIE_MAX_AGE_MS: 24 * 60 * 60 * 1000,
} as const;

export const IPFS_CONSTANTS = {
  // 1 hour — covers multi-GB uploads on slow connections.
  // Note: files >100MB should use TUS (tus-js-client with JWT header) for resumable uploads.
  // createSignedURL is intended for files up to ~100MB or metadata JSON.
  SIGNED_URL_EXPIRES_SEC: 60 * 60,

  // 25 GB — Pinata's documented per-file limit
  MAX_MODEL_FILE_SIZE_BYTES: 25 * 1024 * 1024 * 1024,

  ALLOWED_MODEL_MIME_TYPES: [
    "application/octet-stream",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-tar",
  ],
} as const;
