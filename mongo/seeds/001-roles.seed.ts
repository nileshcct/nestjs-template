import { model } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';
import { Role, RoleSchema } from 'src/infrastructure/database/mongo/schemas/authorization/roles.schema';

const RoleModel = model<Role>(COLLECTIONS.ROLES, RoleSchema);
export async function run() {
  const roles = [
    { key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Super administrator role', isSystem: true },
    { key: 'ADMIN', name: 'Admin', description: 'Administrator role', isSystem: true },
    { key: 'USER', name: 'User', description: 'User role', isSystem: true },
  ];

  for (const role of roles) {
    await RoleModel.updateOne(
      { key: role.key },
      { $setOnInsert: role },
      { upsert: true },
    );
  }

  console.log('[SEED] Roles done');
}
