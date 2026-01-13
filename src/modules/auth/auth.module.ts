import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.usecase';
import { BcryptPasswordHasher } from 'src/infrastructure/crypto/bcrypt-password-hasher';
import { PASSWORD_HASHER, JWT_TOKEN_SERVICE, SEND_VERIFICATION_TOKEN_SERVICE } from 'src/infrastructure/database/database.constants';
import { JwtTokenService } from 'src/infrastructure/jwt/jwt-token.service';
import { UserModule } from '../users/users.module';
import { SendVerificationTokenService } from './application/services/send-verification-token.service';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/config/app.config';
import { ResendOtpUseCase } from './application/use-cases/resend-otp.usecase';

@Module({
  imports : [
    UserModule, 
    JwtModule.register({
    global: true,
    secret: appConfig.auth.accessToken.secret,
    signOptions: { expiresIn: '60s' },
    })],
  controllers: [AuthController],
  providers: [ 
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    }, 
    {
      provide: SEND_VERIFICATION_TOKEN_SERVICE,
      useClass: SendVerificationTokenService,
    }, 
    {
      provide: JWT_TOKEN_SERVICE,
      useClass: JwtTokenService,
    }, 
     AuthService, RegisterUseCase, RefreshTokenUseCase, LoginUseCase, VerifyOtpUseCase, LogoutUseCase, ResendOtpUseCase
  ],
})
export class AuthModule {}
