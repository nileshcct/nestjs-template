import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  RolePermission,
  RolePermissionDocument,
} from 'src/infrastructure/database/mongo/schemas/authorization/role-permissions.schema'
import { RolePermissionRepository } from 'src/modules/authorization/domain/repositories/role-permission.repository';

@Injectable()
export class MongoRolePermissionRepository
  implements RolePermissionRepository
{
  constructor(
    @InjectModel(RolePermission.name)
    private readonly rolePermissionModel: Model<RolePermissionDocument>,
  ) {}

  // =====================
  // Assign permission to role
  // =====================
  async assignPermission(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    if (
      !Types.ObjectId.isValid(roleId) ||
      !Types.ObjectId.isValid(permissionId)
    ) {
      throw new BadRequestException('Invalid roleId or permissionId')
    }

    try {
      await this.rolePermissionModel.create({
        roleId: new Types.ObjectId(roleId),
        permissionId: new Types.ObjectId(permissionId),
      })
    } catch (err) {
      // duplicate assignment → ignore
      if (err.code === 11000) return
      throw err
    }
  }

  // =====================
  // Remove permission from role
  // =====================
  async removePermission(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    if (
      !Types.ObjectId.isValid(roleId) ||
      !Types.ObjectId.isValid(permissionId)
    ) {
      throw new BadRequestException('Invalid roleId or permissionId')
    }

    await this.rolePermissionModel.deleteOne({
      roleId: new Types.ObjectId(roleId),
      permissionId: new Types.ObjectId(permissionId),
    })
  }

  // =====================
  // Get permission IDs for role
  // =====================
  async findPermissionIdsByRoleId(roleId: string): Promise<string[]> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException('Invalid roleId')
    }

    const permissions = await this.rolePermissionModel
      .find({ roleId: new Types.ObjectId(roleId) })
      .select('permissionId')
      .lean()

    return permissions.map(p => p.permissionId.toString())
  }

  // =====================
  // Check if role has permission
  // =====================
  async hasPermission(
    roleId: string,
    permissionId: string,
  ): Promise<boolean> {
    if (
      !Types.ObjectId.isValid(roleId) ||
      !Types.ObjectId.isValid(permissionId)
    ) {
      return false
    }

    const exists = await this.rolePermissionModel.exists({
      roleId: new Types.ObjectId(roleId),
      permissionId: new Types.ObjectId(permissionId),
    })

    return !!exists
  }

  // =====================
  // Remove all permissions for role
  // =====================
  async removeAllPermissionsForRole(roleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException('Invalid roleId')
    }

    await this.rolePermissionModel.deleteMany({
      roleId: new Types.ObjectId(roleId),
    })
  }
}
