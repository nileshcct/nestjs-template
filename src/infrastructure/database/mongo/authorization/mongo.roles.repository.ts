import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Role, RoleDocument } from 'src/infrastructure/database/mongo/schemas/authorization/roles.schema'
import { RoleRepository } from 'src/modules/authorization/domain/repositories/role.repository'

@Injectable()
export class MongoRoleRepository implements RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  // =====================
  // Create role
  // =====================
  async create(data: {
    key: string
    description?: string
  }): Promise<Role> {
    try {
      const role = await this.roleModel.create({
        key: data.key.toUpperCase(),
        description: data.description,
      })

      return role.toObject()
    } catch (err) {
      throw err
    }
  }

  // =====================
  // Find by ID
  // =====================
  async findById(id: string): Promise<Role | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role ID format')
    }

    const role = await this.roleModel.findById(id).lean()
    return role ?? null
  }

  // =====================
  // Find by key
  // =====================
  async findByKey(key: string): Promise<Role | null> {
    const role = await this.roleModel.findOne({
      key: key.toUpperCase(),
    }).lean()

    return role ?? null
  }

  // =====================
  // List all roles
  // =====================
  async findAll(): Promise<Role[]> {
    return this.roleModel.find().lean()
  }

  // =====================
  // Update role
  // =====================
  async update(
    id: string,
    data: Partial<{ key: string; description?: string }>,
  ): Promise<Role> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role ID format')
    }

    const updateData: any = { ...data }

    if (updateData.key) {
      updateData.key = updateData.key.toUpperCase()
    }

    const role = await this.roleModel.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    if (!role) {
      throw new BadRequestException(`Role not found: ${id}`)
    }

    return role.toObject()
  }

  // =====================
  // Delete role
  // =====================
  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role ID format')
    }

    await this.roleModel.findByIdAndDelete(id)
  }
}
