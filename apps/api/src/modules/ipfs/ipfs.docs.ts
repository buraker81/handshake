import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const GetSignedUrlDocs = () =>
  applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: "Get a signed upload URL for IPFS",
      description:
        "Returns a pre-signed URL valid for 60 seconds. The client uses this URL to upload the model file directly to IPFS/Pinata without routing the file through the API server. Requires authentication.",
    }),
    ApiResponse({
      status: 200,
      description: "Signed URL generated",
      schema: { example: { signedUrl: "https://uploads.pinata.cloud/v3/files?X-Algorithm=..." } },
    }),
    ApiResponse({ status: 401, description: "Not authenticated" }),
    ApiResponse({ status: 502, description: "Failed to generate upload URL from storage provider" }),
  );
