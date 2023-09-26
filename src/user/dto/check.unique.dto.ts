import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Check Email Is Unique Input DTO
 */
@Exclude()
export class CheckEmailUniqueDto {
  /** Email */
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}

/**
 * Check Phone Number Is Unique Input DTO
 */
@Exclude()
export class CheckPhoneNumberUniqueDto {
  /** Phone Number */
  @Expose()
  @IsNotEmpty()
  phoneNumber?: string;
}

/**
 * Check UserName Is Unique Input DTO
 */
@Exclude()
export class CheckUserNameUniqueDto {
  /** UserName */
  @Expose()
  @IsNotEmpty()
  userName: string;
}
