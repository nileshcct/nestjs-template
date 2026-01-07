import { PASSWORD_HASHER, REFRESH_TOKEN_REPOSITORY } from 'src/infrastructure/database/database.constants';
import * as refreshTokenRepository from '../../domain/repositories/refresh-token.repository';
import * as passwordHasher from '../services/password-hasher';
import { Inject } from '@nestjs/common';

export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: refreshTokenRepository.RefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
  ) {}

  //  async execute(sessionId: string): Promise<void> {
  //   // 1. Revoke refresh tokens for this session
  //   await this.refreshTokenRepo.revokeBySessionId(sessionId);

  //   // 2. Revoke session
  //   await this.sessionRepo.revoke(sessionId);
  // }
}

