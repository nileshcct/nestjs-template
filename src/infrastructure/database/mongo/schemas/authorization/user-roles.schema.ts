import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

export type UserRoleDocument = UserRole & Document;
@Schema({collection: COLLECTIONS.USER_ROLES, timestamps: true })
export class UserRole extends Document {
  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.USERS, required: true, index: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: COLLECTIONS.ROLES, required: true, index: true })
  roleId: Types.ObjectId
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole)

// Prevent duplicate role assignments
UserRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true })

