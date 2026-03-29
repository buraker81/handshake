import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const GetNonceDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: "Get a one-time nonce for SIWE",
      description: "Generates a single-use nonce valid for 10 minutes. Must be embedded in the SIWE message before signing.",
    }),
    ApiResponse({ status: 200, description: "Nonce generated", schema: { example: { nonce: "abc123xyz" } } }),
  );

export const VerifyDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: "Verify SIWE signature and create session",
      description: "Verifies the EIP-4361 signed message. On success, sets an HttpOnly session cookie valid for 24h.",
    }),
    ApiBody({
      schema: {
        type: "object",
        required: ["message", "signature"],
        properties: {
          message: {
            type: "string",
            description: "The full SIWE message string (EIP-4361 format)",
            example: "localhost:3000 wants you to sign in with your Ethereum account:\n0xAbc...",
          },
          signature: {
            type: "string",
            description: "Hex-encoded ECDSA signature from the wallet",
            example: "0xabc123...",
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: "Session created, cookie set", schema: { example: { ok: true } } }),
    ApiResponse({ status: 401, description: "Invalid signature, nonce, or chain" }),
  );

export const GetMeDocs = () =>
  applyDecorators(
    ApiCookieAuth(),
    ApiOperation({ summary: "Get current authenticated wallet address" }),
    ApiResponse({
      status: 200,
      description: "Authenticated",
      schema: { example: { walletAddress: "0x1a2b3c4d..." } },
    }),
    ApiResponse({ status: 401, description: "Not authenticated" }),
  );

export const LogoutDocs = () =>
  applyDecorators(
    ApiCookieAuth(),
    ApiOperation({ summary: "Destroy session and clear cookie" }),
    ApiResponse({ status: 200, description: "Logged out", schema: { example: { ok: true } } }),
    ApiResponse({ status: 401, description: "Not authenticated" }),
  );
