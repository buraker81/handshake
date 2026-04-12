import { Injectable, Logger } from "@nestjs/common";
import type { PinataAdapter } from "./adapters/pinata.adapter";

export interface SignedUrlOptions {
  fileName: string;
  ownerAddress: string;
}

export interface IStorageProvider {
  uploadJson(data: Record<string, unknown>, ownerAddress: string): Promise<string>;
  createSignedUploadUrl(opts: SignedUrlOptions): Promise<string>;
}

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);

  constructor(private readonly storage: PinataAdapter) {}

  async uploadMetadata(metadata: Record<string, unknown>, ownerAddress: string): Promise<string> {
    this.logger.debug(`Uploading metadata to IPFS for owner=${ownerAddress}`);
    return this.storage.uploadJson(metadata, ownerAddress);
  }

  async getSignedUploadUrl(fileName: string, ownerAddress: string): Promise<string> {
    this.logger.debug(`Requesting signed upload URL: file="${fileName}" owner=${ownerAddress}`);
    return this.storage.createSignedUploadUrl({ fileName, ownerAddress });
  }
}
