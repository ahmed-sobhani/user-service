import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { createKafkaOptions } from './config/messaging.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    createKafkaOptions(),
  );

  await app.listen();
}
bootstrap();
