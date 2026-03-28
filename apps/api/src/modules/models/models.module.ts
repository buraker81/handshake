import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ModelsController } from './models.controller'
import { ModelsService } from './models.service'
import { ModelsRepository } from './models.repository'
import { ModelRecord, ModelSchema } from './schemas'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelRecord.name, schema: ModelSchema }]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService, ModelsRepository],
  exports: [ModelsService],
})

export class ModelsModule {}
