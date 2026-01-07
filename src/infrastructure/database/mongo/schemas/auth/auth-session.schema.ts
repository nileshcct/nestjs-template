
//Even with JWT, sessions matter.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

export type AuthSessionDocument = AuthSession & Document;


@Schema({
  collection: COLLECTIONS.AUTH_SESSIONS,
  timestamps: true,
})
export class AuthSession {
  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.USERS, required: true })
  userId: Types.ObjectId;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const AuthSessionSchema =
  SchemaFactory.createForClass(AuthSession);

// Auto-remove expired sessions
AuthSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
