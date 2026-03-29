import { Injectable, Logger } from "@nestjs/common";
import { PinataSDK } from "pinata";
import type { IStorageProvider } from "../ipfs.service";
import { DomainException, DomainErrorCodes } from "../../../common/exceptions/domain.exception";

@Injectable()
export class PinataAdapter implements IStorageProvider {
  private readonly logger = new Logger(PinataAdapter.name);
  private readonly pinata: PinataSDK;

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.PINATA_GATEWAY!,
    });
  }

  async uploadJson(data: Record<string, unknown>): Promise<string> {
    try {
      const result = await this.pinata.upload.public.json(data);

      this.logger.log(`JSON uploaded to IPFS via Pinata: cid=${result.cid}`);

      return result.cid;

    } catch (err) {
      this.logger.error(`Pinata JSON upload failed: ${(err as Error).message}`);

      throw new DomainException(DomainErrorCodes.IPFS_UPLOAD_FAILED);
    }
  }

  async createSignedUploadUrl(expiresInSeconds: number, fileName: string): Promise<string> {
    try {
      // params 
      const date = Math.floor(new Date().getTime() / 1000);
      const name = fileName;
      const mimeTypes = [
        "image/*",
          "application/json"
      ]


      const url = await this.pinata.upload.public.createSignedURL({ expires: expiresInSeconds });

      this.logger.debug(`Signed upload URL generated via Pinata (expires=${expiresInSeconds}s)`);

      return url;

    } catch (err) {
      this.logger.error(`Pinata signed URL generation failed: ${(err as Error).message}`);

      throw new DomainException(DomainErrorCodes.IPFS_SIGNED_URL_FAILED);
    }
  }
}
