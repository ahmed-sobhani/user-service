import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ProfileDto } from './profile.dto';

/**
 * User Profile DTO
 */
@Exclude()
export class UserProfileDto {
  /** ID */
  @Expose()
  id: string;

  /** First Name */
  @Expose()
  firstName: string;

  /** Last Name */
  @Expose()
  lastName: string;

  /** User Name */
  @Expose()
  userName: string;

  /** Phone Number */
  @Expose()
  phoneNumber: string;

  /** Full Name `firstName lastName` */
  @Expose()
  fullName: string;

  /** Email */
  @Expose()
  email: string;

  /** Is User Verified(By Email/Phone) ? */
  @Expose()
  isVerified: boolean;

  /** Is User Active ? */
  @Expose()
  isActive: boolean;

  /** User Profile */
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ProfileDto)
  profile: ProfileDto;

}
