import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { BcryptPasswordHasher } from 'src/infrastructure/crypto/bcrypt-password-hasher';
import { PASSWORD_HASHER, JWT_TOKEN_SERVICE } from 'src/infrastructure/database/database.constants';
import { JwtTokenService } from 'src/infrastructure/jwt/jwt-token.service';
import { UserModule } from '../users/users.module';

@Module({
  imports : [UserModule],
  controllers: [AuthController],
  providers: [AuthService,  
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    }, 
    {
      provide: JWT_TOKEN_SERVICE,
      useClass: JwtTokenService,
    }, 
    RegisterUseCase, RefreshTokenUseCase, LoginUseCase, LogoutUseCase]
})
export class AuthModule {}
