import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Profile } from './profile.schema';

/**
 * User Mongo Document
 */
export type UserDocument = User & Document;

/**
 * User Mongo Schema
 */
@Schema({ timestamps: true, versionKey: false, toJSON: { virtuals: true } })
export class User {
  /** First Name */
  @Prop({
    required: true,
    index: true,
  })
  firstName: string;

  /** Last Name */
  @Prop({
    required: false,
    index: true,
  })
  lastName?: string;

  /** UserName */
  @Prop({
    required: false,
    sparse: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  userName?: string;

  /** Phone Number */
  @Prop({
    required: false,
    index: true,
    unique: true,
    sparse: true,
    trim: true,
  })
  phoneNumber?: string;

  /** Email */
  @Prop({
    required: false,
    index: true,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  })
  email?: string;

  /** Google Id (for sign in/up with google) */
  @Prop({
    required: false,
  })
  googleId?: string;

  /** Linkedin Id (for sign in/up with linkedin) */
  @Prop({
    required: false,
  })
  linkedinId?: string;

  /** Facebook Id (for sign in/up with facebook) */
  @Prop({
    required: false,
  })
  facebookId?: string;

  /** Apple Id (for sign in/up with apple) */
  @Prop({
    required: false,
  })
  appleId?: string;

  /** Password */
  @Prop({
    required: false,
  })
  password?: string;

  /** Is Active ? */
  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  /** Is Verified ? */
  @Prop({
    required: true,
    default: false,
  })
  isVerified: boolean;

  /** Profile Schema */
  @Prop({
    required: false,
    type: Profile,
  })
  profile?: Profile;

  /** Return Full Name */
  public get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /** Return User Is Enable ? */
  public get isEnable() {
    return this.isActive && this.isVerified;
  }
}

/**
 * User Database Name
 */
export const UserDatabaseName = 'users';

/**
 * Instance of User Mongo Schema 
 */
export const UserSchema = SchemaFactory.createForClass(User);
