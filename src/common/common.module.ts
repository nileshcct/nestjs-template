import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { UserDomainExceptionFilter } from "./filters/user-domain-exception.filter";
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AuthorizationModule } from 'src/modules/authorization/authorization.module'

@Module({
   imports: [
    AuthorizationModule, // REQUIRED for PermissionGuard DI
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
     {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    // Fallback (catch-all) FIRST → lower priority
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    // Specific domain errors LAST → higher priority
    { provide: APP_FILTER, useClass: UserDomainExceptionFilter },
  ],
})
export class CommonModule {}