import { AUTH_SESSION_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from 'src/infrastructure/database/database.constants';
import * as refreshTokenRepository from '../../domain/repositories/refresh-token.repository';
import { Inject } from '@nestjs/common';
import * as authSessionRepository  from '../../domain/repositories/auth-session.repository';

export class LogoutUseCase {
  constructor(
    @Inject(AUTH_SESSION_REPOSITORY) private readonly authSessionRepo : authSessionRepository.AuthSessionRepository ,
    
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: refreshTokenRepository.RefreshTokenRepository,
  ) {}

   async execute(sessionId: string): Promise<void> {
     // defensive — should never happen
    if (!sessionId) {
      return;
    }
    // Revoke refresh tokens for this session
    await this.refreshTokenRepo.revokeSession(sessionId);

    // Revoke session
    await this.authSessionRepo.revoke(sessionId);
  }
}

