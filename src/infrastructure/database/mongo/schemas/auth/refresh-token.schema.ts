import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';


export type RefreshTokenDocument = RefreshToken & Document;

@Schema({
  collection: COLLECTIONS.REFRESH_TOKENS,
  timestamps: true,
})
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.AUTH_SESSIONS, required: true })
  sessionId: Types.ObjectId;

  @Prop({ required: true })
  jti: string;

  @Prop({ required: true })
  tokenHash: string;

  @Prop({ default: false })
  revoked: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshToken);

// TTL cleanup
RefreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
