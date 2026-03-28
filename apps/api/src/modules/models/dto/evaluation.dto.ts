import { IsString, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class BenchmarkDto {
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  score?: number

  @IsOptional()
  @IsString()
  metric?: string

  @IsOptional()
  @IsString()
  date?: string
}

export class EvaluationDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BenchmarkDto)
  benchmarks?: BenchmarkDto[]

  @IsOptional()
  @IsString()
  limitations?: string
}
