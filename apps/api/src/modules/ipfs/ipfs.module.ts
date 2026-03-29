import { Module } from "@nestjs/common";
import { IpfsController } from "./ipfs.controller";
import { IpfsService } from "./ipfs.service";
import { PinataAdapter } from "./adapters/pinata.adapter";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [IpfsController],
  providers: [IpfsService, PinataAdapter],
  exports: [IpfsService],
})
export class IpfsModule {}
