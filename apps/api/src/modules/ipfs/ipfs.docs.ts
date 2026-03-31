import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

export const GetSignedUrlDocs = () =>
  applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: "Get a signed upload URL for IPFS",
      description:
        "Returns a pre-signed URL valid for 1 hour. The client uses this URL to upload the model file directly to IPFS without routing it through the API server. For files >100MB, use TUS (tus-js-client with JWT header) instead — it supports resumable uploads. Requires authentication.",
    }),
    ApiQuery({ name: "fileName", required: true, description: "The model file name including extension (e.g. llama-3-8b.safetensors)", example: "llama-3-8b.safetensors" }),
    ApiResponse({
      status: 200,
      description: "Signed URL generated",
      schema: { example: { signedUrl: "https://uploads.pinata.cloud/v3/files?X-Algorithm=..." } },
    }),
    ApiResponse({ status: 401, description: "Not authenticated" }),
    ApiResponse({ status: 502, description: "Failed to generate upload URL from storage provider" }),
  );
