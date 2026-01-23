import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoAuthModule } from './auth/mongo.auth.module';
import { dbAgnosticPlugin } from '../plugin/db-agnostic.plugin';
import { MongoUserModule } from 'src/infrastructure/database/mongo/user/mongo.user.module';
import { MongoAuthorizationModule } from 'src/infrastructure/database/mongo/authorization/mongo.authorization.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/nest-app',
      {
      connectionFactory: (connection) => {
        connection.plugin(dbAgnosticPlugin);
        return connection;
      },
      }),
      MongoAuthModule,
      MongoAuthorizationModule,
      MongoUserModule,
  ],
  exports: [MongoAuthModule, MongoAuthorizationModule, MongoUserModule],
})
export class MongoDatabaseModule {}
