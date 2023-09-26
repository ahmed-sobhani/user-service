import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResultDto } from 'src/common/dto/result.dto';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { AuthService } from './auth.service';
import {
  LoginByEmailDto,
  LoginByPhoneNumberDto,
  LoginByUniqueDto,
  LoginByUserNameDto,
} from './dto/login.input.dto';

/**
 * Authentication Controller. Auth EndPoints
 */
@Controller('auth')
export class AuthController {
  /**
   * Constructor Authentication Controller
   * @param authService Instance of Authentication Service
   */
  constructor(private readonly authService: AuthService) { }

  /**
   * SignIn User By Email
   * @param Object Contain Email and Password 
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('loginByEmail')
  async loginByEmail({ email, password }: LoginByEmailDto): Promise<ResultDto> {
    try {
      const data = await this.authService.login({ email }, password);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * SignIn User By User Name
   * @param Object Contain UesrName and Password 
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('loginByUserName')
  async loginByUserName({ userName, password }: LoginByUserNameDto): Promise<ResultDto> {
    try {
      const data = await this.authService.login({ userName }, password);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * SignIn User By Phone
   * @param Object Contain Phone and Password 
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('loginByPhone')
  async loginByPhoneNumber({ phoneNumber, password }: LoginByPhoneNumberDto): Promise<ResultDto> {
    try {
      const data = await this.authService.login({ phoneNumber }, password);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * SignIn User By One of Unique Fields(Email/UserName/Phone)
   * @param Object Contain User and Password 
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('loginByUnique')
  async loginByUnique({ user, password }: LoginByUniqueDto): Promise<ResultDto> {
    try {
      const data = await this.authService.login(
        {
          $or: [{ email: user }, { userName: user }, { phoneNumber: user }],
        },
        password,
      );
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * SignUp User
   * @param body User Information
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('register')
  async createUser(body: CreateUserDto): Promise<ResultDto> {
    try {
      const data = await this.authService.register(body);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * Validate Authentication By Google
   * @param Object Contain profile and provider 
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('validateAuthByGoogle')
  async validateAuthByGoogle(@Payload() { profile, provider }): Promise<ResultDto> {
    try {
      const data = await this.authService.validateOAuthLogin(profile, provider);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * Validate Authentication By LinkedIn
   * @param Object Contain profile and provider 
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('validateAuthByLinkedin')
  async validateAuthByLinkedin(@Payload() { profile, provider }): Promise<ResultDto> {
    try {
      const data = await this.authService.validateLinkedinOAuthLogin(profile, provider);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'credential failed!' ? 401 : 400,
        null,
        { message: err?.message },
      );
    }
  }

  /**
   * Decode And Validate JWT Token
   * @param data Contain token
   * @returns Basic Response, if successfull, contain status 200 and user information data
   */
  @MessagePattern('jwtTokenDecode')
  public async decodeToken(data: { token: string }): Promise<ResultDto> {
    const tokenData = await this.authService.decodeToken(data.token);
    return new ResultDto(
      tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      tokenData,
      !tokenData ? 'UnAuthorized Access Token' : null,
    );
  }
}
