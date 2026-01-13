import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '../user/prisma.user.repository';
import {  USER_REPOSITORY} from 'src/infrastructure/database/database.constants';

@Module({
 
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})

export class PrismaUserModule {}
