import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { validateApiEnv } from "@handshake/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const env = validateApiEnv();
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.use(cookieParser());

  app.enableCors({
    origin: env.CLIENT_URL,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Handshake API")
    .setDescription("Decentralized AI Model Registry")
    .setVersion("0.1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = env.PORT;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
