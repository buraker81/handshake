import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class DatasetDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  sourceId?: string

  @IsOptional()
  @IsString()
  license?: string
}

export class TrainingDataDto {
  @IsOptional()
  @IsString()
  summary?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DatasetDto)
  datasets?: DatasetDto[]

  @IsOptional()
  @IsString()
  privacyMeasures?: string
}
