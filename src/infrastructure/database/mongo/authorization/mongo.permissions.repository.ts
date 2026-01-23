import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {Permission,PermissionDocument } from 'src/infrastructure/database/mongo/schemas/authorization/permission.schema';
import { PermissionRepository } from 'src/modules/authorization/domain/repositories/permission.repository';

@Injectable()
export class MongoPermissionRepository implements PermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  // =====================
  // Create permission
  // =====================
  async create(data: {
    key: string
    domain: string
    action: string
  }): Promise<Permission> {
    try {
      const permission = await this.permissionModel.create({
        key: data.key.toUpperCase(),
        domain: data.domain.toLowerCase(),
        action: data.action.toLowerCase(),
      })

      return permission.toObject()
    } catch (err) {
      throw err
    }
  }

  // =====================
  // Find by ID
  // =====================
  async findById(id: string): Promise<Permission | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid permission ID format')
    }

    const permission = await this.permissionModel.findById(id).lean()
    return permission ?? null
  }

  // =====================
  // Find by key
  // =====================
  async findByKey(key: string): Promise<Permission | null> {
    const permission = await this.permissionModel.findOne({
      key: key.toUpperCase(),
    }).lean()

    return permission ?? null
  }

  // =====================
  // List all permissions
  // =====================
  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().lean()
  }

  // =====================
  // Update permission
  // =====================
  async update(
    id: string,
    data: Partial<{
      key: string
      domain: string
      action: string
    }>,
  ): Promise<Permission> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid permission ID format')
    }

    const updateData: any = { ...data }

    if (updateData.key) {
      updateData.key = updateData.key.toUpperCase()
    }
    if (updateData.domain) {
      updateData.domain = updateData.domain.toLowerCase()
    }
    if (updateData.action) {
      updateData.action = updateData.action.toLowerCase()
    }

    const permission = await this.permissionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    )

    if (!permission) {
      throw new BadRequestException(`Permission not found: ${id}`)
    }

    return permission.toObject()
  }

  // =====================
  // Delete permission
  // =====================
  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid permission ID format')
    }

    await this.permissionModel.findByIdAndDelete(id)
  }
}
