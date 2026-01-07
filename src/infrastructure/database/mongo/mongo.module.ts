import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUserModule } from 'src/infrastructure/database/mongo/user/mongo.user.module';
import { MongoAuthModule } from './auth/mongo.auth.module';
import { dbAgnosticPlugin } from '../plugin/db-agnostic.plugin';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/nest-app',
      {
      connectionFactory: (connection) => {
        connection.plugin(dbAgnosticPlugin);
        return connection;
      },
      }),
    MongoUserModule,
    MongoAuthModule,
  ],
  exports: [MongoUserModule, MongoAuthModule],
})
export class MongoDatabaseModule {}
