import type { AuthRepository } from '../../domain/repositories/auth.repository';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import * as passwordHasher from '../services/password-hasher';
import * as tokenService from '../services/token.service';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { Inject, Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { AUTH_CREDENTIAL_REPOSITORY, AUTH_IDENTITY_REPOSITORY, AUTH_REPOSITORY, AUTH_SESSION_REPOSITORY, JWT_TOKEN_SERVICE, PASSWORD_HASHER, REFRESH_TOKEN_REPOSITORY, USER_REPOSITORY } from 'src/infrastructure/database/database.constants';
import * as userRepository from 'src/modules/users/domain/user.repository';
import * as authSessionRepository  from '../../domain/repositories/auth-session.repository';
import * as authCredentialRepository  from '../../domain/repositories/auth-credential.repository';
import * as authIdentityRepository from '../../domain/repositories/auth-identity.repository';
import { appConfig } from 'src/config/app.config';
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: RefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
    @Inject(JWT_TOKEN_SERVICE) private readonly tokenService: tokenService.TokenService,
    @Inject(AUTH_SESSION_REPOSITORY) private readonly authSessionRepo : authSessionRepository.AuthSessionRepository ,
    @Inject(AUTH_CREDENTIAL_REPOSITORY) private readonly credentialRepo: authCredentialRepository.AuthCredentialRepository,
     @Inject(AUTH_IDENTITY_REPOSITORY) private readonly identityRepo: authIdentityRepository.AuthIdentityRepository,
    
  ) {}

  async execute(email: string, password: string, meta: { ip: string; userAgent: string }) {
    const user = await this.identityRepo.findByProvider('EMAIL',email);
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const authcredentials = await this.credentialRepo.findByIdentityId(user.id);
    if (!authcredentials || !authcredentials.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await this.passwordHasher.compare(
      password,
      authcredentials.passwordHash,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create session
    const session = await this.authSessionRepo.create({
      userId: user.userId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + appConfig.auth.session.ttlMs),
    });


    const accessToken = this.tokenService.generateAccessToken({
      sub: user.userId,
      sid: session.id,
    });

    const {rawToken : refreshToken, jti} = this.tokenService.generateRefreshToken();
    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);

    await this.refreshTokenRepo.create(
    {
      jti,
      sessionId : session.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + appConfig.auth.refreshToken.ttlMs),
    }
  );

    return {
      accessToken,
      refreshToken,
    };
  }
}
