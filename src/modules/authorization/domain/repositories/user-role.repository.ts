export interface UserRoleRepository {
  assignRole(userId: string, roleId: string): Promise<void>
  removeRole(userId: string, roleId: string): Promise<void>
  findRoleIdsByUserId(userId: string): Promise<string[]>
  hasRole(userId: string, roleId: string): Promise<boolean>
  removeAllRolesForUser(userId: string): Promise<void>
}
