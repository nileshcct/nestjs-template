import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { RoleRepository } from 'src/modules/authorization/domain/repositories/role.repository'

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // Create role
  // =====================
  async create(data: {
    name: string
    key: string
    description?: string
  }) {
    return this.prisma.role.create({
      data: {
        name : data.name,
        key: data.key.toUpperCase(),
        description: data.description,
      },
    })
  }

  // =====================
  // Find by ID
  // =====================
  async findById(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid role ID')
    }

    return this.prisma.role.findUnique({
      where: { id },
    })
  }

  // =====================
  // Find by key
  // =====================
  async findByKey(key: string) {
    return this.prisma.role.findUnique({
      where: {
        key: key.toUpperCase(),
      },
    })
  }

  // =====================
  // List all roles
  // =====================
  async findAll() {
    return this.prisma.role.findMany()
  }

  // =====================
  // Update role
  // =====================
  async update(
    id: string,
    data: Partial<{ key: string; description?: string }>,
  ) {
    if (!id) {
      throw new BadRequestException('Invalid role ID')
    }

    const updateData: any = {}

    if (data.key) updateData.key = data.key.toUpperCase()
    if (data.description !== undefined) {
      updateData.description = data.description
    }

    try {
      return await this.prisma.role.update({
        where: { id },
        data: updateData,
      })
    } catch {
      throw new BadRequestException(`Role not found: ${id}`)
    }
  }

  // =====================
  // Delete role
  // =====================
  async delete(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid role ID')
    }

    try {
      await this.prisma.role.delete({
        where: { id },
      })
    } catch {
      throw new BadRequestException(`Role not found: ${id}`)
    }
  }
}
