import { Exclude, Expose } from 'class-transformer';

/**
 * Basic and common API response on all systems and services
 */
@Exclude()
export class ResultDto {

  /**
   * Create an object of Result 
   * @param status Status of request
   * @param data Response data
   * @param error If request failed, error has value
   */
  constructor(status: number, data?: any, error?: any) {
    this.status = status;
    this.data = data;
    this.error = error;
  }

  /** Status of response */
  @Expose()
  status: number;

  /** If request success, data is exist. Data is base on response */
  @Expose()
  data?: any;

  /** If request fail, error is exist and has value */
  @Expose()
  error?: any;
}
