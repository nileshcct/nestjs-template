

import { PrismaClient } from 'src/generated/prisma';

export async function run(prisma : PrismaClient) {
  const permissions = [
    // user domain
    { domain: 'user', action: 'read' },
    { domain: 'user', action: 'create' },
    { domain: 'user', action: 'update' },
    { domain: 'user', action: 'delete' },

    // role domain
    { domain: 'role', action: 'read' },
    { domain: 'role', action: 'manage' },

    // permission domain
    { domain: 'permission', action: 'read' },
    { domain: 'permission', action: 'manage' },
  ].map((p) => ({
    ...p,
    key: `${p.domain.toUpperCase()}_${p.action.toUpperCase()}`,
    version: 1,
  }));

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {},
      create: permission,
    });
  }

  console.log('[SEED] Permissions done');
}
