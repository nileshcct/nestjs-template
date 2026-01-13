import { Module } from '@nestjs/common';
import {
  AUTH_CREDENTIAL_REPOSITORY,
  AUTH_IDENTITY_REPOSITORY,
  AUTH_SESSION_REPOSITORY,
  AUTH_VERIFICATION_TOKEN_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
} from '../../database.constants';

import { PrismaAuthCredentialRepository } from './prisma-auth-credential.repository';
import { PrismaAuthIdentityRepository } from './prisma-auth-identity.repository';
import { PrismaAuthSessionRepository } from './prisma-auth-session.repository';
import { PrismaAuthVerificationTokenRepository } from './prisma-auth-verification-token.repository';
import { PrismaRefreshTokenRepository } from './prisma-refresh-token.repository';

@Module({
  providers: [
    {
      provide: AUTH_CREDENTIAL_REPOSITORY,
      useClass: PrismaAuthCredentialRepository,
    },
    {
      provide: AUTH_IDENTITY_REPOSITORY,
      useClass: PrismaAuthIdentityRepository,
    },
    {
      provide: AUTH_SESSION_REPOSITORY,
      useClass: PrismaAuthSessionRepository,
    },
    {
      provide: AUTH_VERIFICATION_TOKEN_REPOSITORY,
      useClass: PrismaAuthVerificationTokenRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [
    AUTH_CREDENTIAL_REPOSITORY,
    AUTH_IDENTITY_REPOSITORY,
    AUTH_SESSION_REPOSITORY,
    AUTH_VERIFICATION_TOKEN_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
  ],
})
export class PrismaAuthModule {}
