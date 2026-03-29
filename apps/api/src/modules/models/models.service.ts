import { Injectable, Logger } from "@nestjs/common";
import { ModelsRepository } from "./models.repository";
import { IpfsService } from "../ipfs/ipfs.service";
import { DomainException, DomainErrorCodes } from "../../common/exceptions/domain.exception";
import type { IModel, CreateModelDTO } from "@handshake/types";
import { ListModelsQueryDto } from "./requests/list-models-query-dto";

@Injectable()
export class ModelsService {
  private readonly logger = new Logger(ModelsService.name);

  constructor(
    private readonly repo: ModelsRepository,
    private readonly ipfsService: IpfsService,
  ) {}

  async checkDuplicate(hash: string) {
    const result = await this.repo.existsByHash(hash);
    if (result.exists) {
      this.logger.debug(`Duplicate check hit: hash=${hash.slice(0, 16)}...`);
    }
    return result;
  }

  async listModels(filter: ListModelsQueryDto) {
    const models = await this.repo.findAll(filter);
    this.logger.debug(`Listed models: count=${Array.isArray(models) ? models.length : "?"} filter=${JSON.stringify(filter)}`);
    return models;
  }

  async getModel(id: string): Promise<IModel> {
    const model = await this.repo.findById(id);

    if (!model) {
      this.logger.warn(`Model not found: id=${id}`);
      throw new DomainException(DomainErrorCodes.MODEL_NOT_FOUND);
    }

    return model;
  }

  async createModel(dto: CreateModelDTO, ownerAddress: string): Promise<IModel> {
    const { exists } = await this.repo.existsByHash(dto.modelHash);

    if (exists) {
      this.logger.warn(`Duplicate model upload rejected: hash=${dto.modelHash.slice(0, 16)}... owner=${ownerAddress}`);
      throw new DomainException(DomainErrorCodes.MODEL_DUPLICATE);
    }

    const metadataCid = await this.ipfsService.uploadMetadata({
      ...dto,
      ownerAddress,
      createdAt: new Date().toISOString(),
    });

    const model = await this.repo.create({
      ...dto,
      ownerAddress,
      metadataCid,
      baseModel: dto.baseModel ?? [],
      tags: dto.tags ?? [],
      languages: dto.languages ?? [],
      onChainRegistered: false,
    });

    this.logger.log(`Model created: name="${dto.name}" owner=${ownerAddress} hash=${dto.modelHash.slice(0, 16)}...`);
    return model;
  }

  // prototype
  calculateProvenanceScore(model: IModel): number {
    let score = 0;

    // Bronze base: onChainRegistered + modelHash + license
    if (model.onChainRegistered && model.modelHash && model.license) {
      score += 40;
    }

    // Silver +20: baseModel declared + 1+ dataset + description > 50 chars
    const hasLineage = Array.isArray(model.baseModel) && model.baseModel.length > 0;
    const hasDataset = (model.trainingData?.datasets?.length ?? 0) >= 1;
    const hasDescription = (model.description?.length ?? 0) > 50;
    if (hasLineage && hasDataset && hasDescription) {
      score += 20;
    }

    // Gold +20: benchmarks + intendedUse + languages
    const hasBenchmarks = (model.evaluation?.benchmarks?.length ?? 0) > 0;
    const hasIntendedUse = Boolean(model.intendedUse);
    const hasLanguages = (model.languages?.length ?? 0) > 0;
    if (hasBenchmarks && hasIntendedUse && hasLanguages) {
      score += 20;
    }

    return score;
  }
}
