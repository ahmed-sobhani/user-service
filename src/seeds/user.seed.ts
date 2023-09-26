import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/schemas/user.schema';

/**
 * User Data Seeder
 */
@Injectable()
export class UserSeed {
  /**
   * UserSeed Constructor
   * @param userService Inject User Service
   */
  constructor(
    private readonly userService: UserService,
  ) {}

  /**
   * Create First Admin User Command
   * email: admin@mail.com
   * default password: 123456
   */
  @Command({
    command: 'create:user',
    describe: 'insert users',
  })
  async create(): Promise<void> {

    const check: UserDocument = await this.userService.findOne();
    if (check) {
      console.error('Only for initial purpose');
      process.exit(0);
    }

    try {
      await this.userService.create({
        firstName: 'super',
        lastName: 'admin',
        userName: 'superadmin',
        email: 'admin@mail.com',
        password: '123456',
        phoneNumber: '+989212345678',
      });
      console.info('Insert User Succeed');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
  }

  /**
   * Remove All Existed Users Command
   */
  @Command({
    command: 'remove:user',
    describe: 'remove users',
  })
  async remove(): Promise<void> {
    try {
      await this.userService.deleteMany({});
      console.info('Remove User Succeed');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
  }
}
