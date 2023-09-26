import { Exclude, Expose } from 'class-transformer';

/**
 * Login Response Data Model
 */
@Exclude()
export class LoginOutputDto {
  /** User JWT Token */
  @Expose()
  token: string;

  /** User Information */
  @Expose()
  user: any;
}
