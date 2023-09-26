import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { ResultDto } from 'src/common/dto/result.dto';
import {
  CheckEmailUniqueDto,
  CheckPhoneNumberUniqueDto,
  CheckUserNameUniqueDto,
} from './dto/check.unique.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { GetUsersDto } from './dto/get.users.dto';
import { UserProfileDto } from './dto/user.profile.dto';
import { UserService } from './user.service';

/**
 * User Controller. User Pattern Endpoints
 */
@Controller('user')
export class UserController {
  /**
   * User Controller Constructor
   * @param userService Inject User Service
   */
  constructor(private readonly userService: UserService) { }

  /**
   * Check Entered Email Is Unique
   * @param CheckEmailUniqueDto Entered Email 
   * @returns If be unique, status 200 Else status 403
   */
  @MessagePattern('checkEmailUnique')
  async checkEmailUnique({ email }: CheckEmailUniqueDto) {
    try {
      const data = await this.userService.isEmailUnique(email);

      return data
        ? new ResultDto(200, data, null)
        : new ResultDto(403, data, 'email exists');
    } catch (err) {
      return new ResultDto(500, null, 'internal server error');
    }
  }

  /**
   * Check Entered Phone Number Is Unique
   * @param CheckPhoneNumberUniqueDto Entered Phone Number 
   * @returns If be unique, status 200 Else status 403
   */
  @MessagePattern('checkPhoneNumberUnique')
  async checkPhoneNumberUnique(
    @Payload() { phoneNumber }: CheckPhoneNumberUniqueDto,
  ) {
    try {
      const data = await this.userService.isPhoneNumberUnique(phoneNumber);

      return data
        ? new ResultDto(200, data, null)
        : new ResultDto(403, data, 'phone number exists');
    } catch (err) {
      return new ResultDto(500, null, 'internal server error');
    }
  }

  /**
   * Check Entered User Name Is Unique
   * @param CheckPhoneNumberUniqueDto Entered User Name
   * @returns If be unique, status 200 Else status 403
   */
  @MessagePattern('checkUserNameUnique')
  async checkUserNameUnique({ userName }: CheckUserNameUniqueDto) {
    try {
      const data = await this.userService.isUserNameUnique(userName);

      return data
        ? new ResultDto(200, data, null)
        : new ResultDto(403, data, 'username exists');
    } catch (err) {
      return new ResultDto(500, null, 'internal server error');
    }
  }

  /**
   * Create User
   * @param CreateUserDto User Info DTO
   * @returns if create successfully 200 and user inf else returen the Error
   */
  @MessagePattern('createUser')
  async createUser(body: CreateUserDto) {
    try {
      const data = await this.userService.create(body);
      const user = plainToClass(UserProfileDto, data);
      return new ResultDto(200, user, null);
    } catch (err) {
      return new ResultDto(
        err === 'internal server error' ? 500 : 400,
        null,
        err,
      );
    }
  }

  /**
   * Get All Users By Paginations
   * @param GetUsersDto Get Users Filters And Paginate Options
   * @returns Basic Response, if successfull, contain status 200 and paginated user list data
   */
  @MessagePattern('findAllUsers')
  async findAll({ filters, options }: GetUsersDto) {
    try {
      const data = await this.userService.findAll(filters, options);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err === 'internal server error' ? 500 : 400,
        null,
        err,
      );
    }
  }

  /**
   * Get One User Profile Info
   * @param Object contains Id
   * @returns Basic Response, if successfull, contain status 200 and user profile details
   */
  @MessagePattern('getUserProfile')
  async userProfile({ id }: any) {
    try {
      const data = await this.userService.findOneById(id);
      const user = plainToClass(UserProfileDto, data);
      return new ResultDto(200, user, null);
    } catch (err) {
      return new ResultDto(
        err === 'internal server error' ? 500 : 400,
        null,
        err,
      );
    }
  }

  /**
   * Update an User Info
   * @param Object Contain id(User Id) and body(User new data)
   * @returns Basic Response, if successfull, contain status 200 and TRUE as data
   */
  @MessagePattern('updateUserProfile')
  async updateUserProfile({ id, body }: any) {
    try {
      const data = await this.userService.updateOneById(id, body);
      const user = plainToClass(UserProfileDto, data);
      return new ResultDto(200, user, null);
    } catch (err) {
      return new ResultDto(
        err === 'internal server error' ? 500 : 400,
        null,
        err,
      );
    }
  }

  /**
   * Remove an User
   * @param Object Contain id(User Id) 
   * @returns Basic Response, if successfull, contain status 200 and TRUE as data
   */
  @MessagePattern('removeUserById')
  async delete(@Payload() { id }) {
    try {
      const data = await this.userService.deleteOneById(id);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err === 'internal server error' ? 500 : 400,
        null,
        err,
      );
    }
  }

}
