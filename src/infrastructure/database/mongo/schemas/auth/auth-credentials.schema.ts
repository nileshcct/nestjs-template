//Only for LOCAL auth.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

export type AuthCredentialDocument = AuthCredential & Document;

@Schema({
  collection: COLLECTIONS.AUTH_CREDENTIALS,
  timestamps: true,
})
export class AuthCredential {
  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.AUTH_IDENTITIES, required: true })
  identityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.USERS, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'bcrypt' })
  algo: string;

  @Prop()
  lastRotatedAt?: Date;
}

export const AuthCredentialSchema =
  SchemaFactory.createForClass(AuthCredential);
