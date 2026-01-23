import { Injectable, BadRequestException } from '@nestjs/common'
import { RolePermissionRepository } from 'src/modules/authorization/domain/repositories/role-permission.repository'
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaRolePermissionRepository
  implements RolePermissionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // Assign permission to role
  // =====================
  async assignPermission(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    if (!roleId || !permissionId) {
      throw new BadRequestException('Invalid roleId or permissionId')
    }

    try {
      await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      })
    } catch (err: any) {
      // duplicate assignment → ignore
      if (err.code === 'P2002') return
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
    if (!roleId || !permissionId) {
      throw new BadRequestException('Invalid roleId or permissionId')
    }

    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    })
  }

  // =====================
  // Get permission IDs for role
  // =====================
  async findPermissionIdsByRoleId(roleId: string): Promise<string[]> {
    if (!roleId) {
      throw new BadRequestException('Invalid roleId')
    }

    const permissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    })

    return permissions.map(p => p.permissionId)
  }

  // =====================
  // Check if role has permission
  // =====================
  async hasPermission(
    roleId: string,
    permissionId: string,
  ): Promise<boolean> {
    if (!roleId || !permissionId) {
      return false
    }

    const exists = await this.prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
      select: { id: true },
    })

    return !!exists
  }

  // =====================
  // Remove all permissions for role
  // =====================
  async removeAllPermissionsForRole(roleId: string): Promise<void> {
    if (!roleId) {
      throw new BadRequestException('Invalid roleId')
    }

    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    })
  }
}
