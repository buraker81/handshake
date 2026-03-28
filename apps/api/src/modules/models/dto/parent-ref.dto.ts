import { IsString, IsEnum, IsOptional } from 'class-validator'
import { Source, Relationship } from '@handshake/types'

export class ParentRefDto {
  @IsString()
  name: string

  @IsEnum(Source)
  source: Source

  @IsEnum(Relationship)
  relationship: Relationship

  @IsOptional()
  @IsString()
  handshakeId?: string

  @IsOptional()
  @IsString()
  modelHash?: string

  @IsOptional()
  @IsString()
  externalId?: string
}
