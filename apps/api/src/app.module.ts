import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelsModule } from "./modules/models/models.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? "mongodb://localhost:27017/handshake"),
    AuthModule,
    ModelsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
