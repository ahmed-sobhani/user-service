import { Module } from '@nestjs/common';
import { HelperModule } from 'src/helper/helper.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    HelperModule,
    JwtModule.register({
      secret: configService.getJWTSecret(),
      signOptions: { expiresIn: configService.getTokenExpireIn() },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
