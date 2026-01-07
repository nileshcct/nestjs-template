//Supports multiple login providers per user.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

export type AuthIdentityDocument = AuthIdentity & Document;

@Schema({
  collection: COLLECTIONS.AUTH_IDENTITIES,
  timestamps: true,
})
export class AuthIdentity {
  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.USERS, required: true })
  userId: Types.ObjectId;

  @Prop({
    enum: ['EMAIL', 'PHONE', 'GOOGLE', 'GITHUB'],
    required: true,
  })
  provider: string;

  @Prop({ required: true })
  providerUserId: string;
  
 @Prop({ type: Boolean, default: false })
  verified: boolean;
}

export const AuthIdentitySchema =
  SchemaFactory.createForClass(AuthIdentity);

// Composite unique index
AuthIdentitySchema.index(
  { provider: 1, providerUserId: 1 },
  { unique: true },
);
