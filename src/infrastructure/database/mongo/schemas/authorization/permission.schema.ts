import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

@Schema({ collection: COLLECTIONS.PERMISSIONS, timestamps: true })
export class Permission {
  @Prop({ unique: true, index: true })
  key: string;

  @Prop({ index: true })
  domain: string;

  @Prop()
  action: string;


  @Prop({ default: 1 })
  version: number;

  @Prop({ default: false })
  deprecated: boolean;
}

export type PermissionDocument = Permission & Document;
export const PermissionSchema =
  SchemaFactory.createForClass(Permission);
