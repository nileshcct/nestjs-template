export interface RolePermissionRepository {
  assignPermission(roleId: string, permissionId: string): Promise<void>
  removePermission(roleId: string, permissionId: string): Promise<void>
  findPermissionIdsByRoleId(roleId: string): Promise<string[]>
  hasPermission(roleId: string, permissionId: string): Promise<boolean>
  removeAllPermissionsForRole(roleId: string): Promise<void>
}
