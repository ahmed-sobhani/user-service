import { Exclude, Expose } from 'class-transformer';

/**
 * User Addresses DTO
 */
@Exclude()
export class UserAddressDto {
  /** Country */
  @Expose()
  country: string;

  /** Province */
  @Expose()
  province: string;

  /** City */
  @Expose()
  city: string;

  /** Address Part One */
  @Expose()
  address1: string;

  /** Address Part Two */
  @Expose()
  address2: string;

  /** Latitude */
  @Expose()
  lat: string;

  /** Logitude */
  @Expose()
  long: string;

  /** Full Address (Joined All Fields) */
  @Expose()
  fullAddress: string;
}
