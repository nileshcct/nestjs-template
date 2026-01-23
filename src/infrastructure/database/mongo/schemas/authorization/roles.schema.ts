import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

@Schema({collection: COLLECTIONS.ROLES, timestamps: true })
export class Role {
  @Prop({ unique: true, index: true })
  key: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isSystem: boolean;
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
