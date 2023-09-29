import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UserModule } from './user/user.module';
import { SeedsModule } from './seeds/seeds.module';
import { HelperModule } from './helper/helper.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { ClientsModuleAsyncProviderOptions, busFactory } from './config/messaging.config';
import { KafkaClientProxy } from './common/messaging/kafka.client.proxy';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => configService.getMongoDBOptions(),
    }),
    UserModule,
    SeedsModule,
    HelperModule,
    AuthModule,
    ClientsModule.registerAsync(ClientsModuleAsyncProviderOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaClientProxy,
    busFactory,
  ],
})
export class AppModule {}
