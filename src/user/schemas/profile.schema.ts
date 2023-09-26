import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address, AddressrSchema } from './address.schema';
import { ProfileSocials } from './socials.schema';

/**
 * Profile Schema
 */
@Schema()
export class Profile {
  /** Avatar */
  @Prop({
    required: false,
  })
  avatar?: string;

  /** Description */
  @Prop({
    required: false,
  })
  description?: string;

  /** Biography */
  @Prop({
    required: false,
  })
  bio?: string;

  /** TimeZone */
  @Prop({
    required: false,
  })
  timeZone?: string;

  /** Language */
  @Prop({
    required: false,
  })
  language?: string;

  /** Array of Socials */
  @Prop({
    required: false,
    type: ProfileSocials,
  })
  socials?: ProfileSocials;

  /** Array of Addresses */
  @Prop({
    type: [AddressrSchema],
    default: [],
  })
  addresses: Address[];
}

/**
 * Instance of Profile Mongo Schema 
 */
export const ProfileSchema = SchemaFactory.createForClass(Profile);
