import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './role.schema';
import { Permission } from './permission.schema';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

@Schema({collection: COLLECTIONS.ROLE_PERMISSIONS, timestamps: true })
export class RolePermission {
  @Prop({ type: Types.ObjectId, ref: Role.name, index: true })
  roleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Permission.name, index: true })
  permissionId: Types.ObjectId;
}

export type RolePermissionDocument =
  RolePermission & Document;

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);

RolePermissionSchema.index(
  { roleId: 1, permissionId: 1 },
  { unique: true },
);
