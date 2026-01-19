
import { PrismaClient } from 'src/generated/prisma';
export async function run(prisma : PrismaClient) {
  const roles = [
    { key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Super administrator role', isSystem: true },
    { key: 'ADMIN', name: 'Admin', description: 'Administrator role', isSystem: true },
    { key: 'USER', name: 'User', description: 'User role', isSystem: true },
  ];

 for (const role of roles) {
    const existing = await prisma.role.findFirst({ where: { key: role.key } });
    if (!existing) {
      await prisma.role.create({ data: role });
    }
  }
  console.log('[SEED] Roles done');
}
