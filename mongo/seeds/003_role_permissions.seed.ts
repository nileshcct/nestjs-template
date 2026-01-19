
import { model } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';
import { Permission, PermissionSchema } from 'src/infrastructure/database/mongo/schemas/auth/permission.schema';
import { Role, RoleSchema } from 'src/infrastructure/database/mongo/schemas/auth/role.schema';
import { RolePermission, RolePermissionSchema } from 'src/infrastructure/database/mongo/schemas/auth/role-permission.schema';


const RoleModel = model<Role>(COLLECTIONS.ROLES, RoleSchema);
const PermissionModel = model<Permission>(COLLECTIONS.PERMISSIONS, PermissionSchema);
const RolePermissionModel = model<RolePermission>(COLLECTIONS.ROLE_PERMISSIONS, RolePermissionSchema);

export async function run() {
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
    const role = await RoleModel.findOne({ key: roleKey });
    if (!role) continue;

    const permissions = await PermissionModel.find({
      key: { $in: permissionKeys },
    });

    for (const permission of permissions) {
      await RolePermissionModel.updateOne(
        {
          roleId: role._id,
          permissionId: permission._id,
        },
        { $setOnInsert: { roleId: role._id, permissionId: permission._id } },
        { upsert: true },
      );
    }
  }

  console.log('[SEED] Role-Permissions done');
}
