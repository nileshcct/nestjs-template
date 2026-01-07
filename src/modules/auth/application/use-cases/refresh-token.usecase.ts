import { AUTH_SESSION_REPOSITORY, JWT_TOKEN_SERVICE, PASSWORD_HASHER, REFRESH_TOKEN_REPOSITORY } from 'src/infrastructure/database/database.constants';
import * as refreshTokenRepository from '../../domain/repositories/refresh-token.repository';
import * as passwordHasher from '../services/password-hasher';
import * as tokenService from '../services/token.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import * as authSessionRepository  from '../../domain/repositories/auth-session.repository';
import { appConfig } from 'src/config/app.config';

export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_SESSION_REPOSITORY) private readonly authSessionRepo : authSessionRepository.AuthSessionRepository ,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: refreshTokenRepository.RefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
    @Inject(JWT_TOKEN_SERVICE) private readonly tokenService: tokenService.TokenService,
  ) {}

  async execute(refreshToken: string) {
    const [jti] = refreshToken.split('.');
    const storedToken = await this.refreshTokenRepo.findByJti(jti);
    if (!storedToken || storedToken.revoked) {
      throw new UnauthorizedException();
    }
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isValid = await this.passwordHasher.compare(
      refreshToken,
      storedToken.tokenHash,
    );

    const session = await this.authSessionRepo.findById(storedToken.sessionId);
    if (!isValid ||!session || !session.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Rotate refresh token
    await this.refreshTokenRepo.revoke(storedToken.tokenHash);

    const {rawToken : newRefreshToken, jti : jti_id} = this.tokenService.generateRefreshToken();
    const newRefreshTokenHash = await this.passwordHasher.hash(newRefreshToken);

    await this.refreshTokenRepo.create(
    {
      jti: jti_id,
      sessionId : storedToken.sessionId,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + appConfig.auth.refreshToken.ttlMs),
    }
  );
     const accessToken = this.tokenService.generateAccessToken({
      sub: session.userId,
      sid: storedToken.sessionId,
    });

    return {
    accessToken,
    refreshToken: newRefreshToken,
  };
  }
}
