import { Injectable, Logger } from "@nestjs/common";
import { PinataSDK } from "pinata";
import type { IStorageProvider, SignedUrlOptions } from "../ipfs.service";
import { DomainException, DomainErrorCodes } from "@api/common/exceptions/domain.exception";
import { IPFS_CONSTANTS } from "@api/common/constants";

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

  async uploadJson(data: Record<string, unknown>, ownerAddress: string): Promise<string> {
    try {
      const groupId = await this.getOrCreateUserGroup(ownerAddress);

      const result = await this.pinata.upload.public
        .json(data)
        .group(groupId)
        .keyvalues({ ownerAddress });

      this.logger.log(`Metadata uploaded to IPFS: cid=${result.cid} group=${groupId}`);

      return result.cid;

    } catch (err) {
      if (err instanceof DomainException) throw err;
      this.logger.error(`Pinata JSON upload failed: ${(err as Error).message}`);
      throw new DomainException(DomainErrorCodes.IPFS_UPLOAD_FAILED);
    }
  }

  async createSignedUploadUrl({ fileName, ownerAddress }: SignedUrlOptions): Promise<string> {
    try {
      const groupId = await this.getOrCreateUserGroup(ownerAddress);

      const url = await this.pinata.upload.public.createSignedURL({
        expires: IPFS_CONSTANTS.SIGNED_URL_EXPIRES_SEC,
        name: fileName,
        mimeTypes: [...IPFS_CONSTANTS.ALLOWED_MODEL_MIME_TYPES],
        maxFileSize: IPFS_CONSTANTS.MAX_MODEL_FILE_SIZE_BYTES,
        groupId,
        keyvalues: { ownerAddress },
      });

      this.logger.debug(`Signed upload URL generated: file="${fileName}" group=${groupId} expires=${IPFS_CONSTANTS.SIGNED_URL_EXPIRES_SEC}s`);
      return url;

    } catch (err) {
      if (err instanceof DomainException) throw err;
      this.logger.error(`Pinata signed URL generation failed: ${(err as Error).message}`);
      throw new DomainException(DomainErrorCodes.IPFS_SIGNED_URL_FAILED);
    }
  }

  // One group per wallet address — all files (weights + metadata) go into the same group.
  // Non-fatal: if group API fails, upload continues without grouping.
  private async getOrCreateUserGroup(ownerAddress: string): Promise<string> {
    const groupName = ownerAddress;
    try {
      const existing = await this.pinata.groups.public.list().name(groupName);
      if (existing.groups.length > 0) {
        return existing.groups[0].id;
      }

      const group = await this.pinata.groups.public.create({ name: groupName, isPublic: true });
      this.logger.log(`Created Pinata group for owner: ${ownerAddress} → id=${group.id}`);
      return group.id;

    } catch (err) {
      this.logger.warn(`Failed to get/create Pinata group for ${ownerAddress}: ${(err as Error).message}`);
      return "";
    }
  }
}
