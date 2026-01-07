import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCredential, AuthCredentialSchema } from '../schemas/auth/auth-credentials.schema';
import { AuthIdentity, AuthIdentitySchema } from '../schemas/auth/auth-identity.schema';
import { AuthSession, AuthSessionSchema } from '../schemas/auth/auth-session.schema';
import { RefreshToken, RefreshTokenSchema } from '../schemas/auth/refresh-token.schema';

import {MongoAuthCredentialRepository} from './mongo-auth-credential.repository'
import {MongoAuthIdentityRepository} from './mongo-auth-identity.repository'
import {MongoAuthSessionRepository} from './mongo-auth-session.repository'
import {MongoRefreshTokenRepository} from './mongo-refresh-token.repository'
import { AUTH_REPOSITORY, REFRESH_TOKEN_REPOSITORY, USER_REPOSITORY, AUTH_CREDENTIAL_REPOSITORY,AUTH_IDENTITY_REPOSITORY, AUTH_SESSION_REPOSITORY } from '../../database.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthCredential.name, schema: AuthCredentialSchema },
      { name: AuthIdentity.name, schema: AuthIdentitySchema },
      { name: AuthSession.name, schema: AuthSessionSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [
    {
      provide: AUTH_CREDENTIAL_REPOSITORY,
      useClass: MongoAuthCredentialRepository,
    },
    {
      provide: AUTH_IDENTITY_REPOSITORY,
      useClass: MongoAuthIdentityRepository,
    },
    {
      provide: AUTH_SESSION_REPOSITORY,
      useClass: MongoAuthSessionRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: MongoRefreshTokenRepository,
    },
  ],
  exports: [REFRESH_TOKEN_REPOSITORY, AUTH_CREDENTIAL_REPOSITORY, AUTH_IDENTITY_REPOSITORY, AUTH_SESSION_REPOSITORY],
})

export class MongoAuthModule {}
