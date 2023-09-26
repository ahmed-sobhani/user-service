import { Exclude, Expose } from 'class-transformer';

/**
 * User Socials DTO
 */
@Exclude()
export class UserSocialsDto {
  /** Linkedin */
  @Expose()
  linkedin: string;

  /** Instagram */
  @Expose()
  instagram: string;

  /** Facebook */
  @Expose()
  facebook: string;

  /** WhatsApp */
  @Expose()
  whatsapp: string;

  /** Telegram */
  @Expose()
  telegram: string;

  /** Twitter */
  @Expose()
  twitter: string;

  /** Youtube */
  @Expose()
  youtube: string;

  /** Website Link */
  @Expose()
  webSite: string;
}
