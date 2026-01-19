
import { PrismaClient } from 'src/generated/prisma';

export async function run(prisma: PrismaClient) {
  const map: Record<string, string[]> = {
    SUPER_ADMIN: [
      'USER_READ',
      'USER_CREATE',
      'USER_UPDATE',
      'USER_DELETE',
      'ROLE_READ',
      'ROLE_MANAGE',
      'PERMISSION_READ',
      'PERMISSION_MANAGE',
    ],
    ADMIN: ['USER_READ', 'USER_CREATE', 'USER_UPDATE', 'ROLE_READ'],
    USER: [],
  };

  for (const [roleKey, permissionKeys] of Object.entries(map)) {
    const role = await prisma.role.findUnique({ where: { key: roleKey } });
    if (!role) continue;

    const permissions = await prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
    });

    for (const permission of permissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log('[SEED] Role-Permissions done');
}
