import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { RequirePermissions } from 'src/common/decorators/permission.decorator';
import { Permissions } from 'src/modules/authorization/constants/permission.constants';
@RequirePermissions(Permissions.ROLE_MANAGE)
@Controller('authorization')
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
  ) {}

  // =====================
  // USER <=> ROLE
  // =====================
  @Post('users/:userId/roles/:roleId')
  assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.authorizationService.assignRoleToUser(userId, roleId)
  }

  @Delete('users/:userId/roles/:roleId')
  removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.authorizationService.removeRoleFromUser(userId, roleId)
  }

  @Get('users/:userId/roles')
  getUserRoles(@Param('userId') userId: string) {
    return this.authorizationService.getUserRoleIds(userId)
  }

  // =====================
  // ROLE <=> PERMISSION
  // =====================
  @Post('roles/:roleId/permissions/:permissionId')
  assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.authorizationService.assignPermissionToRole(
      roleId,
      permissionId,
    )
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.authorizationService.removePermissionFromRole(
      roleId,
      permissionId,
    )
  }

  @Get('roles/:roleId/permissions')
  getRolePermissions(@Param('roleId') roleId: string) {
    return this.authorizationService.getPermissionIdsForRole(roleId)
  }

  // =====================
  // USER => PERMISSIONS
  // =====================
  @Get('users/:userId/permissions')
  getUserPermissions(@Param('userId') userId: string) {
    return this.authorizationService.getUserPermissionIds(userId)
  }
}
