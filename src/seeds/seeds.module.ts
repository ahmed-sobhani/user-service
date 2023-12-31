import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserModule } from 'src/user/user.module';
import { UserSeed } from './user.seed';

/**
 * Seeder Module
 */
@Module({
  imports: [CommandModule, UserModule],
  providers: [UserSeed],
})
export class SeedsModule {}
