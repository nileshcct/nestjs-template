
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';
import { VerificationTokenType } from 'src/modules/auth/constants/auth-verification-token-type.enum';

@Schema({
  collection: COLLECTIONS.AUTH_VERIFICATION_TOKENS,
  timestamps: true,
})
export class AuthVerificationToken {
  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.AUTH_IDENTITIES, required: true })
  identityId: Types.ObjectId;

  @Prop({
    enum: VerificationTokenType,
    required: true,
  })
  type: string;

  @Prop({ required: true })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  usedAt?: Date;
}

export const AuthVerificationTokenSchema =
  SchemaFactory.createForClass(AuthVerificationToken);

// TTL cleanup
AuthVerificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
