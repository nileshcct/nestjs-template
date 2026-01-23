import { Module } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service'
import { PrismaRoleRepository } from 'src/infrastructure/database/prisma/authorization/prisma.roles.repository'
import { PrismaPermissionRepository } from 'src/infrastructure/database/prisma/authorization/prisma.permissions.repository'
import { PrismaRolePermissionRepository } from 'src/infrastructure/database/prisma/authorization/prisma.role-permissions.repository'
import { PrismaUserRoleRepository } from 'src/infrastructure/database/prisma/authorization/prisma.user-roles.repository'
import {
  ROLES_REPOSITORY,
  PERMISSIONS_REPOSITORY,
  ROLE_PERMISSIONS_REPOSITORY,
  USER_ROLES_REPOSITORY,
} from 'src/infrastructure/database/database.constants'

@Module({
  providers: [
    PrismaService,

    {
      provide: ROLES_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PERMISSIONS_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: ROLE_PERMISSIONS_REPOSITORY,
      useClass: PrismaRolePermissionRepository,
    },
    {
      provide: USER_ROLES_REPOSITORY,
      useClass: PrismaUserRoleRepository,
    },
  ],
  exports: [
    ROLES_REPOSITORY,
    PERMISSIONS_REPOSITORY,
    ROLE_PERMISSIONS_REPOSITORY,
    USER_ROLES_REPOSITORY,
  ],
})
export class PrismaAuthorizationModule {}
