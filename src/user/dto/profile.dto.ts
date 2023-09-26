import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserAddressDto } from './user.address.dto';
import { UserSocialsDto } from './user.social.dto';

/**
 * Get User Profile Output DTO
 */
@Exclude()
export class ProfileDto {
  /** Avatar */
  @Expose()
  avatar: string;

  /** Description */
  @Expose()
  description: string;

  /** Biography */
  @Expose()
  bio: string;

  /** User TimeZone */
  @Expose()
  timeZone: string;

  /** User Language */
  @Expose()
  language: string;

  /** Array of User Socials */
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserSocialsDto)
  socials: UserSocialsDto;

  /** Array of User Addresses */
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserAddressDto)
  addresses: UserAddressDto[];
}
