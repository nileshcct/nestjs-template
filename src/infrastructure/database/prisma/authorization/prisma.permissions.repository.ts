import { Injectable, BadRequestException } from '@nestjs/common'
import { PermissionRepository } from 'src/modules/authorization/domain/repositories/permission.repository'
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // Create permission
  // =====================
  async create(data: {
    key: string
    domain: string
    action: string
  }) {
    return this.prisma.permission.create({
      data: {
        key: data.key.toUpperCase(),
        domain: data.domain.toLowerCase(),
        action: data.action.toLowerCase(),
      },
    })
  }

  // =====================
  // Find by ID
  // =====================
  async findById(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid permission ID')
    }

    return this.prisma.permission.findUnique({
      where: { id },
    })
  }

  // =====================
  // Find by key
  // =====================
  async findByKey(key: string) {
    return this.prisma.permission.findUnique({
      where: {
        key: key.toUpperCase(),
      },
    })
  }

  // =====================
  // List all permissions
  // =====================
  async findAll() {
    return this.prisma.permission.findMany()
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
  ) {
    if (!id) {
      throw new BadRequestException('Invalid permission ID')
    }

    const updateData: any = {}

    if (data.key) updateData.key = data.key.toUpperCase()
    if (data.domain) updateData.domain = data.domain.toLowerCase()
    if (data.action) updateData.action = data.action.toLowerCase()

    try {
      return await this.prisma.permission.update({
        where: { id },
        data: updateData,
      })
    } catch (err) {
      // Prisma throws if record not found
      throw new BadRequestException(`Permission not found: ${id}`)
    }
  }

  // =====================
  // Delete permission
  // =====================
  async delete(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid permission ID')
    }

    try {
      await this.prisma.permission.delete({
        where: { id },
      })
    } catch {
      throw new BadRequestException(`Permission not found: ${id}`)
    }
  }
}
