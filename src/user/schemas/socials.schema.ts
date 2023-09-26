import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Socials
 */
@Schema()
export class ProfileSocials {
  /** Linkedin */
  @Prop({
    required: false,
  })
  linkedin?: string;

  /** Instagram */
  @Prop({
    required: false,
  })
  instagram?: string;

  /** Facebook */
  @Prop({
    required: false,
  })
  facebook?: string;

  /** WhatsApp */
  @Prop({
    required: false,
  })
  whatsapp?: string;

  /** Telegram */
  @Prop({
    required: false,
  })
  telegram?: string;

  /** Twitter */
  @Prop({
    required: false,
  })
  twitter?: string;

  /** Youtube */
  @Prop({
    required: false,
  })
  youtube?: string;

  /** Website */
  @Prop({
    required: false,
  })
  webSite?: string;
}

/**
 * Instance of Social Mongo Schema 
 */
export const ProfileSocialsSchema =
  SchemaFactory.createForClass(ProfileSocials);
