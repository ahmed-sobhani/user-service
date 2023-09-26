import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Address Schema
 */
@Schema({ toJSON: { virtuals: true } })
export class Address {
  /** Country */
  @Prop({
    required: false,
  })
  country?: string;

  /** Province */
  @Prop({
    required: false,
  })
  province?: string;

  /** City */
  @Prop({
    required: false,
  })
  city?: string;

  /** Address Part One */
  @Prop({
    required: false,
  })
  address1?: string;

  /** Address Part Two */
  @Prop({
    required: false,
  })
  address2?: string;

  /** Latitude */
  @Prop({
    required: false,
  })
  lat?: string;

  /** Longitude */
  @Prop({
    required: false,
  })
  long?: string;

  /** Return Full Address */
  public get fullAddress() {
    return `${this.country} ${this.province} ${this.city} ${this.address1} ${this.address2}`;
  }
}

/**
 * Instance of Address Mongo Schema 
 */
export const AddressrSchema = SchemaFactory.createForClass(Address);
