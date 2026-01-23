import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { UserRole, UserRoleDocument } from 'src/infrastructure/database/mongo/schemas/authorization/user-roles.schema'
import { UserRoleRepository } from 'src/modules/authorization/domain/repositories/user-role.repository'

@Injectable()
export class MongoUserRoleRepository implements UserRoleRepository {
  constructor(
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocument>,
  ) {}

  // =====================
  // Assign role to user
  // =====================
  async assignRole(userId: string, roleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException('Invalid userId or roleId')
    }

    try {
      await this.userRoleModel.create({
        userId: new Types.ObjectId(userId),
        roleId: new Types.ObjectId(roleId),
      })
    } catch (err) {
      // duplicate assignment → ignore or rethrow based on policy
      if (err.code === 11000) return
      throw err
    }
  }

  // =====================
  // Remove role from user
  // =====================
  async removeRole(userId: string, roleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException('Invalid userId or roleId')
    }

    await this.userRoleModel.deleteOne({
      userId: new Types.ObjectId(userId),
      roleId: new Types.ObjectId(roleId),
    })
  }

  // =====================
  // Get role IDs for user
  // =====================
  async findRoleIdsByUserId(userId: string): Promise<string[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId')
    }

    const roles = await this.userRoleModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('roleId')
      .lean()

    return roles.map(r => r.roleId.toString())
  }

  // =====================
  // Check if user has role
  // =====================
  async hasRole(userId: string, roleId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(roleId)) {
      return false
    }

    const exists = await this.userRoleModel.exists({
      userId: new Types.ObjectId(userId),
      roleId: new Types.ObjectId(roleId),
    })

    return !!exists
  }

  // =====================
  // Remove all roles for user
  // =====================
  async removeAllRolesForUser(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId')
    }

    await this.userRoleModel.deleteMany({
      userId: new Types.ObjectId(userId),
    })
  }
}
