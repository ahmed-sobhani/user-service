import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HelperService } from 'src/helper/helper.service';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create.user.dto';
import { GetPaginateDto } from './dto/get.users.dto';
import { UserProfileDto } from './dto/user.profile.dto';
import { plainToClass } from 'class-transformer';

/**
 * User Service
 */
@Injectable()
export class UserService {
  /**
   * User Service Constructor
   * @param userModel Inject User Model
   * @param helperService Inject Helper Service
   */
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly helperService: HelperService,
  ) { }

  /**
   * Find All Users
   * @param find Find Query
   * @param options Pagination Options
   * @returns Paginaited Array of Users
   */
  async findAll(
    find?: Record<string, any>,
    options?: GetPaginateDto,
  ): Promise<any> {
    const findAll = this.userModel.find(find);

    if (options && options.limit) {
      findAll
        .sort({ _id: -1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);
    }

    const users = await findAll.exec();
    const data = plainToClass(UserProfileDto, users);
    const total = await this.getTotalData(find);
    return {
      data,
      total,
    };
  }

  /**
   * Get Total Number of Users By Query
   * @param find Find Query
   * @returns Number of Users
   */
  async getTotalData(find?: Record<string, any>): Promise<number> {
    return await this.userModel.countDocuments(find);
  }

  /**
   * Find a User By Id
   * @param userId Id of User
   * @param populate Do Populate Related Models ?
   * @returns Details of a User
   */
  async findOneById(userId: string, populate: boolean = true): Promise<any> {
    const user = this.userModel.findById(userId);

    return await user.exec();
  }

  /**
   * Find a User
   * @param find Find Query
   * @param populate Do Populate Related Models ?
   * @returns Details of a User
   */
  async findOne(
    find?: Record<string, any>,
    populate: boolean = true,
  ): Promise<any> {
    const user = this.userModel.findOne(find);

    return await user.exec();
  }

  /**
   * Create a New User
   * @param data CreateUserDto
   * @returns Inserted User 
   */
  async create(data: CreateUserDto): Promise<UserDocument> {
    try {
      const unique = await this.checkUnique(data);
      if (!unique.uniqueEmail) throw new RpcException('email exist');
      if (!unique.uniquePhone) throw new RpcException('phone number exist');
      if (!unique.uniqueUserName) throw new RpcException('username exist');

      const salt: string = await this.helperService.randomSalt();
      const passwordHash = await this.helperService.bcryptHashPassword(
        data?.password,
        salt,
      );

      const newUser: User = new User();

      newUser.firstName = data?.firstName?.toLowerCase();
      newUser.lastName = data?.lastName?.toLowerCase();
      newUser.email = data?.email?.toLowerCase();
      newUser.phoneNumber = data?.phoneNumber;
      newUser.userName = data?.userName?.toLowerCase();
      newUser.password = passwordHash;

      if (data?.lastName) {
        newUser.lastName = data?.lastName.toLowerCase();
      }

      const create: UserDocument = new this.userModel(newUser);
      return await create.save();
    } catch (err) {
      console.error(err);
      throw new RpcException(
        err && err?.message ? err.message : 'internal server error',
      );
    }
  }

  /**
   * Check User is Unique
   * @param data Contain Email, UserName, and Phone Number
   * @returns All Result for User Unique By Email, UserName, and Phone Number
   */
  async checkUnique(data: any): Promise<any> {
    const uniqueEmail =
      data?.email && data?.email !== ''
        ? await this.isEmailUnique(data?.email)
        : true;
    const uniquePhone =
      data?.phoneNumber && data?.phoneNumber !== ''
        ? await this.isPhoneNumberUnique(data?.phoneNumber)
        : true;
    const uniqueUserName =
      data?.userName && data?.userName !== ''
        ? await this.isUserNameUnique(data?.userName)
        : true;

    return {
      uniqueEmail,
      uniquePhone,
      uniqueUserName,
    };
  }

  /**
   * Check User Email Is Unique 
   * @param email User Email
   * @returns if is unique, True; ELse false
   */
  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.findOne({ email: email.toLowerCase() });
    return user ? false : true;
  }

  /**
   * Check User Phone Number Is Unique 
   * @param phoneNumber User Phone Number
   * @returns if is unique, True; ELse false
   */
  async isPhoneNumberUnique(phoneNumber: string): Promise<boolean> {
    const user = await this.findOne({ phoneNumber: phoneNumber.toLowerCase() });
    return user ? false : true;
  }

  /**
   * Check User User Name Is Unique 
   * @param userName UserName of User
   * @returns if is unique, True; ELse false
   */
  async isUserNameUnique(userName: string): Promise<boolean> {
    const user = await this.findOne({ userName: userName.toLowerCase() });
    return user ? false : true;
  }

  /**
   * Remove One User
   * @param userId Id of User
   * @returns If Delete Successfully, return TRUE. Else return FALSE
   */
  async deleteOneById(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userModel
        .findByIdAndDelete(userId)
        .then(() => {
          resolve(true);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * Delete Many Users
   * @param find Find Query
   * @returns If Delete All Successfully, return TRUE. Else return FALSE
   */
  async deleteMany(find: Record<string, any>): Promise<boolean> {
    try {
      await this.userModel.deleteMany(find);
      return true;
    } catch (e: unknown) {
      return false;
    }
  }

  /**
   * Update an User
   * @param userId Id of User
   * @param data New User Data
   * @returns Updated User Date
   */
  async updateOneById(
    userId: string,
    data: any
  ): Promise<UserDocument> {
    await this.userModel.findByIdAndUpdate(
      userId,
      data
    );
    return await this.findOneById(userId)
  }

}
