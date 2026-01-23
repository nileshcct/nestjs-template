import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { UserRoleRepository } from 'src/modules/authorization/domain/repositories/user-role.repository'

@Injectable()
export class PrismaUserRoleRepository implements UserRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // Assign role to user
  // =====================
  async assignRole(userId: string, roleId: string): Promise<void> {
    if (!userId || !roleId) {
      throw new BadRequestException('Invalid userId or roleId')
    }

    try {
      await this.prisma.userRole.create({
        data: {
          userId,
          roleId,
        },
      })
    } catch (err: any) {
      // duplicate assignment → ignore
      if (err.code === 'P2002') return
      throw err
    }
  }

  // =====================
  // Remove role from user
  // =====================
  async removeRole(userId: string, roleId: string): Promise<void> {
    if (!userId || !roleId) {
      throw new BadRequestException('Invalid userId or roleId')
    }

    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    })
  }

  // =====================
  // Get role IDs for user
  // =====================
  async findRoleIdsByUserId(userId: string): Promise<string[]> {
    if (!userId) {
      throw new BadRequestException('Invalid userId')
    }

    const roles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    })

    return roles.map(r => r.roleId)
  }

  // =====================
  // Check if user has role
  // =====================
  async hasRole(userId: string, roleId: string): Promise<boolean> {
    if (!userId || !roleId) {
      return false
    }

    const exists = await this.prisma.userRole.findFirst({
      where: {
        userId,
        roleId,
      },
      select: { id: true },
    })

    return !!exists
  }

  // =====================
  // Remove all roles for user
  // =====================
  async removeAllRolesForUser(userId: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException('Invalid userId')
    }

    await this.prisma.userRole.deleteMany({
      where: { userId },
    })
  }
}
