import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/infrastructure/database/mongo/schemas/authorization/roles.schema';
import { Permission, PermissionSchema } from 'src/infrastructure/database/mongo/schemas/authorization/permission.schema';
import { RolePermission, RolePermissionSchema } from 'src/infrastructure/database/mongo/schemas/authorization/role-permissions.schema';
import { UserRole, UserRoleSchema } from 'src/infrastructure/database/mongo/schemas/authorization/user-roles.schema';
import { MongoRoleRepository } from 'src/infrastructure/database/mongo/authorization/mongo.roles.repository'
import { MongoPermissionRepository } from 'src/infrastructure/database/mongo/authorization/mongo.permissions.repository'
import { MongoRolePermissionRepository } from 'src/infrastructure/database/mongo/authorization/mongo.role-permissions.repository';
import { MongoUserRoleRepository } from 'src/infrastructure/database/mongo/authorization/mongo.user-roles.repository'
import {  ROLES_REPOSITORY, PERMISSIONS_REPOSITORY,ROLE_PERMISSIONS_REPOSITORY, USER_ROLES_REPOSITORY} from 'src/infrastructure/database/database.constants';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
  ],
  providers: [
    {
      provide: ROLES_REPOSITORY,
      useClass: MongoRoleRepository,
    },
    {
      provide: PERMISSIONS_REPOSITORY,
      useClass: MongoPermissionRepository,
    },
    {
      provide: ROLE_PERMISSIONS_REPOSITORY,
      useClass: MongoRolePermissionRepository,
    },
    {
      provide: USER_ROLES_REPOSITORY,
      useClass: MongoUserRoleRepository,
    },
  ],
  exports:  [ROLES_REPOSITORY, PERMISSIONS_REPOSITORY,ROLE_PERMISSIONS_REPOSITORY, USER_ROLES_REPOSITORY],
})

export class MongoAuthorizationModule {}
