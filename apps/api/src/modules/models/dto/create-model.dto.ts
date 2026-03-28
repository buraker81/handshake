import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Task, Framework, License, Quantization } from '@handshake/types'
import { ParentRefDto } from './parent-ref.dto'
import { TrainingDataDto } from './training-data.dto'
import { EvaluationDto } from './evaluation.dto'

export class CreateModelBodyDto {
  @IsString()
  name: string

  @IsString()
  @MinLength(20)
  description: string

  @IsString()
  version: string

  @IsEnum(Task)
  task: Task

  @IsEnum(Framework)
  framework: Framework

  @IsEnum(License)
  license: License

  @IsString()
  modelHash: string

  @IsString()
  modelFileCid: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParentRefDto)
  baseModel?: ParentRefDto[]

  @IsOptional()
  @ValidateNested()
  @Type(() => TrainingDataDto)
  trainingData?: TrainingDataDto

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => EvaluationDto)
  evaluation?: EvaluationDto

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[]

  @IsOptional()
  @IsString()
  intendedUse?: string

  @IsOptional()
  @IsNumber()
  size?: number

  @IsOptional()
  @IsString()
  modelType?: string

  @IsOptional()
  @IsString()
  parameters?: string

  @IsOptional()
  @IsNumber()
  contextLength?: number

  @IsOptional()
  @IsEnum(Quantization)
  quantization?: Quantization
}
