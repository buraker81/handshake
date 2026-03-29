import { Injectable, Logger } from "@nestjs/common";
import { PinataAdapter } from "./adapters/pinata.adapter";

export interface IStorageProvider {
  uploadJson(data: Record<string, unknown>): Promise<string>;
  createSignedUploadUrl(expiresInSeconds: number): Promise<string>;
}

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);

  constructor(private readonly storage: PinataAdapter) {}

  async uploadMetadata(metadata: Record<string, unknown>): Promise<string> {
    this.logger.debug("Uploading metadata to IPFS...");
    return this.storage.uploadJson(metadata);
  }

  async getSignedUploadUrl(): Promise<string> {
    this.logger.debug("Requesting signed upload URL...");
    return this.storage.createSignedUploadUrl(60);
  }
}
