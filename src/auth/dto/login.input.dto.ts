import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Login By Email Input Data Model
 */
@Exclude()
export class LoginByEmailDto {
  /** Email */
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  email: string;

  /** Password */
  @Expose()
  @IsNotEmpty()
  password: string;
}

/**
 * Login By UserName Input Data Model
 */
@Exclude()
export class LoginByUserNameDto {
  /** User Name */
  @Expose()
  @IsNotEmpty()
  userName: string;

  /** Password */
  @Expose()
  @IsNotEmpty()
  password: string;
}

/**
 * Login By Phone Number Input Data Model
 */
@Exclude()
export class LoginByPhoneNumberDto {
  /** Phone Number */
  @Expose()
  @IsNotEmpty()
  phoneNumber?: string;

  /** Password */
  @Expose()
  @IsNotEmpty()
  password: string;
}

/**
 * Login By Unique Fields(Email/UserName/PhoneNumber) Input Data Model
 */
@Exclude()
export class LoginByUniqueDto {
  /** Email or UserName or PhoneNumber */
  @Expose()
  @IsNotEmpty()
  user?: string;

  /** Password */
  @Expose()
  @IsNotEmpty()
  password: string;
}
