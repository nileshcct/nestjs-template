import { Inject, Injectable } from '@nestjs/common'
import type { RoleRepository } from './domain/repositories/role.repository'
import type { PermissionRepository } from './domain/repositories/permission.repository'
import type { RolePermissionRepository } from './domain/repositories/role-permission.repository'
import type { UserRoleRepository } from './domain/repositories/user-role.repository'
import { PERMISSIONS_REPOSITORY, ROLES_REPOSITORY, ROLE_PERMISSIONS_REPOSITORY, USER_ROLES_REPOSITORY } from 'src/infrastructure/database/database.constants';

@Injectable()
export class AuthorizationService {
  constructor(
     @Inject(ROLES_REPOSITORY) private readonly roleRepo: RoleRepository,
     @Inject(PERMISSIONS_REPOSITORY) private readonly permissionRepo: PermissionRepository,
     @Inject(ROLE_PERMISSIONS_REPOSITORY) private readonly rolePermissionRepo: RolePermissionRepository,
     @Inject(USER_ROLES_REPOSITORY) private readonly userRoleRepo: UserRoleRepository,
  ) {}

  // =====================
  // USER <=> ROLE
  // =====================
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await this.userRoleRepo.assignRole(userId, roleId)
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await this.userRoleRepo.removeRole(userId, roleId)
  }

  async getUserRoleIds(userId: string): Promise<string[]> {
    return this.userRoleRepo.findRoleIdsByUserId(userId)
  }

  // =====================
  // ROLE <=> PERMISSION
  // =====================
  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.rolePermissionRepo.assignPermission(roleId, permissionId)
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.rolePermissionRepo.removePermission(roleId, permissionId)
  }

  async getPermissionIdsForRole(roleId: string): Promise<string[]> {
    return this.rolePermissionRepo.findPermissionIdsByRoleId(roleId)
  }

  // =====================
  // USER => PERMISSIONS (resolved)
  // =====================
  async getUserPermissionIds(userId: string): Promise<string[]> {
    const roleIds = await this.userRoleRepo.findRoleIdsByUserId(userId)

    const permissionSets = await Promise.all(
      roleIds.map(roleId =>
        this.rolePermissionRepo.findPermissionIdsByRoleId(roleId),
      ),
    )

    return [...new Set(permissionSets.flat())]
  }
   async getUserPermissionKeys(userId: string): Promise<string[]> {
    // 1. user => roles
    const roleIds = await this.userRoleRepo.findRoleIdsByUserId(userId)
    if (roleIds.length === 0) return []

    // 2. roles => permissionIds
    const permissionIdSets = await Promise.all(
      roleIds.map(roleId =>
        this.rolePermissionRepo.findPermissionIdsByRoleId(roleId),
      ),
    )

    const permissionIds = [...new Set(permissionIdSets.flat())]
    if (permissionIds.length === 0) return []

    // 3. permissionIds => permission KEYS
    const permissions = await Promise.all(
      permissionIds.map(id => this.permissionRepo.findById(id)),
    )

    return permissions
      .filter(Boolean)
      .map(p => p!.key) // KEY is what guards compare
  }
}
