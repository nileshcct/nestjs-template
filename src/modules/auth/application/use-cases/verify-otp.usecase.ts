import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { VerificationTokenType } from '../../constants/auth-verification-token-type.enum';
import { AUTH_IDENTITY_REPOSITORY, AUTH_VERIFICATION_TOKEN_REPOSITORY, PASSWORD_HASHER } from 'src/infrastructure/database/database.constants';
import * as authIdentityRepository from '../../domain/repositories/auth-identity.repository';
import * as authVerificationTokenRepository from '../../domain/repositories/auth-verification-token.repository';
import * as passwordHasher from '../services/password-hasher';


@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
   @Inject(AUTH_VERIFICATION_TOKEN_REPOSITORY) private readonly verificationTokenRepo: authVerificationTokenRepository.AuthVerificationTokenRepository,
   @Inject(AUTH_IDENTITY_REPOSITORY) private readonly identityRepo: authIdentityRepository.AuthIdentityRepository,
    
  ) {}

  async execute(input: {
    identifier: string;
    otp: string;
    type: VerificationTokenType;
  }): Promise<void> {
    // Find identity by identifier
    const identity = await this.identityRepo.findByIdentifier(
      input.identifier,
    );

    if (!identity) {
      throw new BadRequestException('Invalid verification request');
    }

    // Find valid token for this identity + type
    const token = await this.verificationTokenRepo.findValidByIdentity(
      identity.id,
      input.type,
    );

    if (!token) {
      throw new BadRequestException('OTP expired or invalid');
    }

    // Compare OTP
    const isValid = await this.passwordHasher.compare(
      input.otp,
      token.tokenHash,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // Mark token used
    await this.verificationTokenRepo.markUsed(token.id);

    // Mark identity verified (only for verify types)
    if (
      input.type === VerificationTokenType.EMAIL_VERIFY ||
      input.type === VerificationTokenType.PHONE_VERIFY
    ) {
      await this.identityRepo.markVerified(identity.id);
    }

    // EMAIL_CHANGE / PHONE_CHANGE handled elsewhere
  }
}
