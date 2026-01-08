import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/modules/users/users.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRoot(),
    AuthModule,
    UserModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },],
})
export class AppModule {}
