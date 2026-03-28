import {
  Controller, Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import type { Request } from 'express'
import { ModelsService } from './models.service'
import { CreateModelBodyDto, ListModelsQueryDto } from './dto'
import { AuthGuard } from '../auth/auth.guard'

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) { }

  @Get()
  listModels(@Query() query: ListModelsQueryDto) {
    return this.modelsService.listModels({ owner: query.owner, task: query.task })
  }

  // Must be before :id to avoid route collision
  @Get('check/:hash')
  checkDuplicate(@Param('hash') hash: string) {
    return this.modelsService.checkDuplicate(hash)
  }

  @Get(':id')
  getModel(@Param('id') id: string) {
    return this.modelsService.getModel(id)
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createModel(@Body() body: CreateModelBodyDto, @Req() req: AuthRequest) {
    return this.modelsService.createModel(body, req.user.walletAddress)
  }
}
