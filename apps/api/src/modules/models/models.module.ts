import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelsController } from "./models.controller";
import { ModelsService } from "./models.service";
import { ModelsRepository } from "./models.repository";
import { ModelRecord, ModelSchema } from "./schemas";
import { AuthModule } from "../auth/auth.module";
import { IpfsModule } from "../ipfs/ipfs.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelRecord.name, schema: ModelSchema }]),
    AuthModule,
    IpfsModule,
  ],
  controllers: [ModelsController],
  providers: [ModelsService, ModelsRepository],
  exports: [ModelsService],
})
export class ModelsModule {}
