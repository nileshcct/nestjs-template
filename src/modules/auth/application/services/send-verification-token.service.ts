import { randomInt } from 'crypto';
import * as authVerificationTokenRepository from '../../domain/repositories/auth-verification-token.repository';
import { Inject, Injectable } from '@nestjs/common';
import { VerificationTokenType } from '../../constants/auth-verification-token-type.enum';
import { AUTH_VERIFICATION_TOKEN_REPOSITORY, PASSWORD_HASHER } from 'src/infrastructure/database/database.constants';
import * as passwordHasher from './password-hasher';

@Injectable()
export class SendVerificationTokenService {
  constructor(
    @Inject(AUTH_VERIFICATION_TOKEN_REPOSITORY) private readonly verificationTokenRepo: authVerificationTokenRepository.AuthVerificationTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
    // inject EmailService / SmsService here
  ) {}

  async sendVerificationToken(params: {
    identityId: string;
    userId: string;
    type: VerificationTokenType;
    destination: string;
  }) {
    // Invalidate old tokens
    await this.verificationTokenRepo.invalidateAllForIdentity(
      params.identityId,
      params.type,
    );

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    const tokenHash = await this.passwordHasher.hash(otp);

    await this.verificationTokenRepo.create({
      identityId: params.identityId,
      userId: params.userId,
      type: params.type,
      tokenHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });
    console.log('otp :>> ', otp);

    // Send OTP
    // emailService.send(params.destination, otp)
    // smsService.send(params.destination, otp)
  }
}
