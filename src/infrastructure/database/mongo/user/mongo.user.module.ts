import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/infrastructure/database/mongo/schemas/user/user.schema';
import { MongoUserRepository } from 'src/infrastructure/database/mongo/user/mongo.user.repository';
import {  USER_REPOSITORY} from 'src/infrastructure/database/database.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    MongoUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: MongoUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})

export class MongoUserModule {}
