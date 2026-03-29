import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { AuthGuard } from "./auth.guard";
import { NonceRecord, NonceSchema } from "./schemas/nonce.schema";
import { SessionRecord, SessionSchema } from "./schemas/session.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonceRecord.name, schema: NonceSchema },
      { name: SessionRecord.name, schema: SessionSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
