import { Injectable } from '@nestjs/common'
import { ModelsRepository } from './models.repository'
import { DomainException, DomainErrorCodes } from '../../common/exceptions/domain.exception'
import type { IModel, CreateModelDTO } from '@handshake/types'
import { ListModelsQueryDto } from './dto'

@Injectable()
export class ModelsService {
  constructor(private readonly repo: ModelsRepository) { }

  async checkDuplicate(hash: string) {
    return this.repo.existsByHash(hash)
  }

  async listModels(filter: ListModelsQueryDto) {
    const { ...rest } = filter  
    return await this.repo.findAll(rest)
  }

  async getModel(id: string): Promise<IModel> {
    const model = await this.repo.findById(id)
    if (!model) 
      throw new DomainException(DomainErrorCodes.MODEL_NOT_FOUND);

    return model
  }

  async createModel(dto: CreateModelDTO, ownerAddress: string): Promise<IModel> {
    const { exists } = await this.repo.existsByHash(dto.modelHash)

    if (exists) 
      throw new DomainException(DomainErrorCodes.MODEL_DUPLICATE);

    // TODO: upload metadata JSON to Pinata (PinataModule — Phase 2)
    // const metadataCid = await this.pinataService.uploadMetadata({ ...dto, ownerAddress })
    const metadataCid = ''

    return this.repo.create({
      ...dto,
      ownerAddress,
      metadataCid,
      baseModel: dto.baseModel ?? [],
      tags: dto.tags ?? [],
      languages: dto.languages ?? [],
      onChainRegistered: false,
    })
  }

  //a prototype
  calculateProvenanceScore(model: IModel): number {
    let score = 0

    // Bronze base: onChainRegistered + modelHash + license
    if (model.onChainRegistered && model.modelHash && model.license) {
      score += 40
    }

    // Silver +20: baseModel declared + 1+ dataset + description > 50 chars
    const hasLineage = Array.isArray(model.baseModel) && model.baseModel.length > 0
    const hasDataset = (model.trainingData?.datasets?.length ?? 0) >= 1
    const hasDescription = (model.description?.length ?? 0) > 50
    if (hasLineage && hasDataset && hasDescription) {
      score += 20
    }

    // Gold +20: benchmarks + intendedUse + languages
    const hasBenchmarks = (model.evaluation?.benchmarks?.length ?? 0) > 0
    const hasIntendedUse = Boolean(model.intendedUse)
    const hasLanguages = (model.languages?.length ?? 0) > 0
    if (hasBenchmarks && hasIntendedUse && hasLanguages) {
      score += 20
    }

    return score
  }
}
