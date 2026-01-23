import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaAuthModule } from './auth/prisma.auth.module';
import { PrismaUserModule } from './user/prisma.user.module';
import { PrismaAuthorizationModule } from './authorization/prisma.authorization.module';

@Global()
@Module({
  providers: [PrismaService],
  imports: [PrismaAuthModule, PrismaAuthorizationModule, PrismaUserModule],
  exports: [PrismaService, PrismaAuthModule, PrismaAuthorizationModule, PrismaUserModule],
})
export class PrismaDatabaseModule {}
