
import { model } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';
import { Permission, PermissionSchema } from 'src/infrastructure/database/mongo/schemas/authorization/permission.schema';

const PermissionModel = model<Permission>(COLLECTIONS.PERMISSIONS, PermissionSchema);
export async function run() {
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
    await PermissionModel.updateOne(
      { key: permission.key },
      { $setOnInsert: permission },
      { upsert: true },
    );
  }

  console.log('[SEED] Permissions done');
}
