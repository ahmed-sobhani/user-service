import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

/**
 * Create User DTO
 */
@Exclude()
export class CreateUserDto {
  /** First Name */
  @Expose()
  firstName?: string;

  /** Last Name */
  @Expose()
  lastName?: string;

  /** UserName */
  @Expose()
  userName?: string;

  /** Phone Number */
  @Expose()
  phoneNumber?: string;

  /** Email */
  @Expose()
  @IsEmail()
  email?: string;

  /** Password */
  @Expose()
  @IsNotEmpty()
  password: string;
}
