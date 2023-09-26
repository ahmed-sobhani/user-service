import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { hash, compare, genSalt } from 'bcrypt';
import { isString } from 'class-validator';
import {
  createCipheriv,
  createDecipheriv,
  scrypt,
  createHash,
  randomBytes,
} from 'crypto';
import { promisify } from 'util';

/**
 * Helper Service, Common Usefull Functions
 */
@Injectable()
export class HelperService {
  /**
   * Constructor of Helper Service
   */
  constructor() { }

  /**
   * Generate a Random String With Requested Length
   * @param length length of generated string
   * @returns generated random string
   */
  async randomString(length: number): Promise<string> {
    return randomBytes(length).toString('hex');
  }

  /**
   * Generate a Random Number With Requested Length
   * @param length length of generated number
   * @returns generated random number
   */
  async randomOtpNumber(length: number): Promise<string> {
    const min: number = parseInt(`1`.padEnd(length, '0'));
    const max: number = parseInt(`9`.padEnd(length, '9'));
    return this.randomNumberInRange(min, max);
  }

  /**
   * Generate a Random Number Between 'min' and 'max'
   * @param min Minimum value that generated number can be
   * @param max Maxmimum value that generated number can be
   * @returns generated random number
   */
  async randomNumberInRange(min: number, max: number): Promise<string> {
    return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
  }

  /**
   * DateTime Forward In Minute
   * @param minutes Minutes number
   * @returns DateTime Forward In Minute From Now
   */
  async dateTimeForwardInMinutes(minutes: number): Promise<Date> {
    return moment().add(minutes, 'm').toDate();
  }

  /**
   * DateTime Backward In Minute
   * @param minutes Minutes number
   * @returns DateTime Backward In Minute From Now
   */
  async dateTimeBackwardInMinutes(minutes: number): Promise<Date> {
    return moment().subtract(minutes, 'm').toDate();
  }

  /**
   * DateTime Forward In Day
   * @param minutes Days number
   * @returns DateTime Forward In Day From Now
   */
  async dateTimeForwardInDays(days: number): Promise<Date> {
    return moment().add(days, 'd').toDate();
  }

  /**
   * DateTime Backward In Day
   * @param minutes Days number
   * @returns DateTime Backward In Day From Now
   */
  async dateTimeBackwardInDays(days: number): Promise<Date> {
    return moment().subtract(days, 'd').toDate();
  }

  /**
   * DateTime Forward In Month
   * @param minutes Months number
   * @returns DateTime Forward In Month From Now
   */
  async dateTimeForwardInMonths(months: number): Promise<Date> {
    return moment().add(months, 'M').toDate();
  }

  /**
   * DateTime Backward In Month
   * @param minutes Months number
   * @returns DateTime Backward In Months From Now
   */
  async dateTimeBackwardInMonths(months: number): Promise<Date> {
    return moment().subtract(months, 'M').toDate();
  }

  /**
   *  Bycrypt Hash Password
   * @param passwordString Password String
   * @param salt  Salt 
   * @returns Hashed Password String
   */
  async bcryptHashPassword(
    passwordString: string,
    salt: string,
  ): Promise<string> {
    return hash(passwordString, salt);
  }

  /**
   * Generate Random Salt
   * @returns generated random salt string 
   */
  async randomSalt(): Promise<string> {
    return genSalt(16);
  }

  /**
   * Compare Password And Hashed Password
   * @param passwordString Password String
   * @param passwordHashed Password Hashed String
   * @returns If password and hashedPassword are same, return true. else false
   */
  async bcryptComparePassword(
    passwordString: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return await compare(passwordString, passwordHashed);
  }

  /**
   * Convert String to Base64 String
   * @param data data string
   * @returns generated base64 string
   */
  async base64Encrypt(data: string): Promise<string> {
    const buff: Buffer = Buffer.from(data);
    return buff.toString('base64');
  }

  /**
   * Convert Base64 String to String
   * @param data base64 data string
   * @returns simple data string
   */
  async base64Decrypt(data: string): Promise<string> {
    const buff: Buffer = Buffer.from(data, 'base64');
    return buff.toString('utf8');
  }

  // async jwtCreateToken(
  //     payload: Record<string, any>,
  //     options?: IHelperJwtOptions
  // ): Promise<string> {
  //     return this.jwtService.sign(payload, {
  //         secret:
  //             options.secretKey ||
  //             this.configService.get<string>('helper.jwt.secretKey'),
  //         expiresIn:
  //             options.expiredIn ||
  //             this.configService.get<string>('helper.jwt.expirationTime'),
  //         notBefore:
  //             options.notBefore ||
  //             this.configService.get<string>(
  //                 'helper.jwt.notBeforeExpirationTime'
  //             )
  //     });
  // }

  // async jwtVerify(
  //     token: string,
  //     options?: IHelperJwtOptions
  // ): Promise<boolean> {
  //     const payload: Record<string, any> = this.jwtService.verify(token, {
  //         secret:
  //             options.secretKey ||
  //             this.configService.get<string>('helper.jwt.secretKey')
  //     });

  //     return payload ? true : false;
  // }

  // async jwtPayload(
  //     token: string,
  //     options?: IHelperJwtOptions
  // ): Promise<Record<string, any>> {
  //     return this.jwtService.verify(token, {
  //         secret:
  //             options.secretKey ||
  //             this.configService.get<string>('helper.jwt.secretKey')
  //     });
  // }

  /**
   * AES 256 Bit Encryption Function
   * @param data data string
   * @param key key
   * @param iv iv
   * @returns encrypted AES 256 bit string
   */
  async aes256BitEncrypt(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): Promise<string> {
    let dataParse: string = data as string;
    if (!isString(data)) {
      dataParse = JSON.stringify(data);
    }

    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', crp, iv);

    const encryptedText = Buffer.concat([
      cipher.update(dataParse),
      cipher.final(),
    ]);

    return encryptedText.toString('base64');
  }

  /**
   * AES 256 Bit Decrypt Function
   * @param data data string
   * @param key key
   * @param iv iv
   * @returns decrypted AES 256 bit string
   */
  async aes256BitDecrypt(
    encrypted: string,
    key: string,
    iv: string,
  ): Promise<string> {
    const data: Buffer = Buffer.from(encrypted, 'base64');
    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', crp, iv);
    const decryptedText = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }

  /**
   * SHA 256 Decrypt Function
   * @param string data string
   * @returns decrypted SHA 256 string
   */
  async sha256Decrypt(string: string): Promise<string> {
    return createHash('sha256').update(string).digest('hex');
  }
}
