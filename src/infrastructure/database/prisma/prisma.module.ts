import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaAuthModule } from './auth/prisma.auth.module';
import { PrismaUserModule } from './user/prisma.user.module';

@Global()
@Module({
  providers: [PrismaService],
  imports: [PrismaAuthModule, PrismaUserModule],
  exports: [PrismaService, PrismaAuthModule, PrismaUserModule],
})
export class PrismaDatabaseModule {}
