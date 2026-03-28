import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<>(AppModule)
  const port = process.env.PORT ?? 5000
  await app.listen(port)
  console.log(`API running on http://localhost:${port}`)
}

bootstrap();
