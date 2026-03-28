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

import { ModelsService } from './models.service'
import { ListModelsQueryDto } from './requests/list-models-query-dto'
import { AuthGuard } from '../auth/auth.guard'
import { Request } from 'express'
import { CreateModelDTO, CreateModelSchema } from '@handshake/types'
import { ValidationPipe } from '../../common/pipes/zod-validation.pipe'

type AuthRequest = Request & { user: {walletAddress: string } }

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  listModels(@Query() query: ListModelsQueryDto) {
    console.log(query);
    return this.modelsService.listModels(query);
  }

  // Must be before :id to avoid route collision
  @Get('check/:hash')
  @HttpCode(HttpStatus.OK)
  checkDuplicate(@Param('hash') hash: string) {
    return this.modelsService.checkDuplicate(hash);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getModel(@Param('id') id: string) {
    return this.modelsService.getModel(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createModel(
    @Body(new ValidationPipe(CreateModelSchema)) body: CreateModelDTO,
    @Req() req: AuthRequest,
  ) {
    return this.modelsService.createModel(body, req.user.walletAddress);
  }
}
