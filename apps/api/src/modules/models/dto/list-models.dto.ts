import { IsString, IsEnum, IsOptional } from 'class-validator'
import { Task } from '@handshake/types'

export class ListModelsQueryDto {
  @IsOptional()
  @IsString()
  owner?: string

  @IsOptional()
  @IsEnum(Task)
  task?: Task
}
