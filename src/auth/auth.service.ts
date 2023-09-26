import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { configService } from 'src/config/config.service';
import { HelperService } from 'src/helper/helper.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { UserProfileDto } from 'src/user/dto/user.profile.dto';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { Provider } from './providers';

/**
 * Authentication Service
 */
@Injectable()
export class AuthService {

  /**
   * Constructor of Authentication Service
   * @param userService Instance of User Service
   * @param helperService Instance of Helper Service
   * @param jwtService Instance of JWT Service
   */
  constructor(
    private readonly userService: UserService,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Sign In Function
   * @param find Find Query Like: {email: 'admin@gmail.com' }
   * @param password Password
   * @returns Object that contain UserInfo and JWT Token
   */
  async login(find: any, password: string): Promise<any> {
    try {
      const iuser = await this.userService.findOne(find);
      if (
        !iuser ||
        !(await this.helperService.bcryptComparePassword(password, iuser.password))
      )
        throw new Error('credential failed!');

      const payload = {
        id: iuser.id,
        TokenExpireIn: configService.getTokenExpireIn(),
      };
      const token = await this.jwtService.signAsync(payload);
      const user = plainToClass(UserProfileDto, iuser);
      return {
        token,
        user,
      };
    } catch (err) {
      throw new Error(err?.message);
    }
  }

  /**
   * Sign Up Function
   * @param data User Information
   * @returns Object that contain UserInfo and JWT Token
   */
  async register(data: CreateUserDto): Promise<any> {
    try {
      const iuser: any = await this.userService.create(data);

      const payload = {
        id: iuser.id,
        TokenExpireIn: configService.getTokenExpireIn(),
      };
      const token = await this.jwtService.signAsync(payload);
      const user = plainToClass(UserProfileDto, iuser);
      return {
        token,
        user,
      };
    } catch (err) {
      console.error(err);
      throw new RpcException(err?.message);
    }
  }

  /**
   * Decode and Validate a JWT Token
   * @param token JWT Token
   * @returns User Information
   */
  async decodeToken(token: string) {
    let result: any = null;
    try {
      const tokenData = this.jwtService.decode(token) as {
        TokenExpireIn: number;
        id: any;
        exp: any;
      };
      if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
        result = null;
      } else {
        let user = await this.userService.findOneById(tokenData.id);
        result = user
          ? {
            user,
          }
          : null;
      }
    } catch (e) {
      result = null;
    }

    return result;
  }

  /**
   * Validate Google Authentication. 
   * If User exist, then login. else He/She Will Register in our system
   * @param profile User Information in GOOGLE
   * @param provider 3rd Party Provider Type
   * @returns Object that contain UserInfo and JWT Token
   */
  async validateOAuthLogin(profile: any, provider: Provider): Promise<any> {
    try {
      const { name, emails, photos, id: thirdPartyId } = profile
      let iuser = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        jwt: ''
      }
      let user = await this.userService.findOne({ email: iuser.email })

      if (user) {
        provider == Provider.GOOGLE ?
          user.googleId = profile.id : user.linkedinId = profile.id
        await this.userService.updateOneById(user._id, user)
      } else {
        user = new CreateUserDto();
        user.email = iuser.email;
        user.firstName = iuser.firstName;
        user.lastName = iuser.lastName;
        provider == Provider.GOOGLE ?
          user.googleId = profile.id : user.linkedinId = profile.id;
        await this.userService.create(user);
      }

      const payload = {
        id: user?.id,
        TokenExpireIn: configService.getTokenExpireIn(),
      };
      const token = await this.jwtService.signAsync(payload);
      const userDto = plainToClass(UserProfileDto, user);
      return {
        token,
        user: userDto,
      };
    }
    catch (err) {
      console.error(err);
      throw new RpcException(err?.message);
    }
  }

  /**
   * Validate LinkedIn Authentication. 
   * If User exist, then login. else He/She Will Register in our system
   * @param profile User Information in LINKEDIN
   * @param provider 3rd Party Provider Type
   * @returns Object that contain UserInfo and JWT Token
   */
  async validateLinkedinOAuthLogin(profile: any, provider: Provider): Promise<any> {
    try {
      const { _json, emails, photos } = profile
      const thirdPartyId = _json.id
      let iuser = {
        email: emails[0]?.value,
        firstName: _json.firstName.localized.en_US,
        lastName: _json.lastName.localized.en_US,
        // picture: photos[0].value,
        jwt: ''
      }
      let user = await this.userService.findOne({ email: iuser.email })

      if (user) {
        provider !== Provider.LINKEDIN ?
          user.googleId = thirdPartyId : user.linkedinId = thirdPartyId
        await this.userService.updateOneById(user._id, user)
      } else {
        user = new CreateUserDto();
        user.email = iuser.email;
        user.firstName = iuser.firstName;
        user.lastName = iuser.lastName;
        user.isVerified = true;
        // user.avatar = iuser.picture;
        provider !== Provider.LINKEDIN ?
          user.googleId = thirdPartyId : user.linkedinId = thirdPartyId;
        await this.userService.create(user);
      }

      const payload = {
        id: user?.id,
        TokenExpireIn: configService.getTokenExpireIn(),
      };
      const token = await this.jwtService.signAsync(payload);
      const userDto = plainToClass(UserProfileDto, user);
      return {
        token,
        user: userDto,
      };
    }
    catch (err) {
      console.error(err);
      throw new RpcException(err?.message);
    }
  }
}
