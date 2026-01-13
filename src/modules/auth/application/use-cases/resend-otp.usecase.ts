import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { VerificationTokenType } from '../../constants/auth-verification-token-type.enum';
import { AUTH_IDENTITY_REPOSITORY, AUTH_VERIFICATION_TOKEN_REPOSITORY, PASSWORD_HASHER, SEND_VERIFICATION_TOKEN_SERVICE } from 'src/infrastructure/database/database.constants';
import * as authIdentityRepository from '../../domain/repositories/auth-identity.repository';
import * as authVerificationTokenRepository from '../../domain/repositories/auth-verification-token.repository';
import * as passwordHasher from '../services/password-hasher';
import  { SendVerificationTokenService } from '../services/send-verification-token.service';

@Injectable()
export class ResendOtpUseCase {
  constructor(
    @Inject(AUTH_IDENTITY_REPOSITORY) private readonly identityRepo: authIdentityRepository.AuthIdentityRepository,
    @Inject(AUTH_VERIFICATION_TOKEN_REPOSITORY) private readonly tokenRepo: authVerificationTokenRepository.AuthVerificationTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
    @Inject(SEND_VERIFICATION_TOKEN_SERVICE) private readonly sendVerificationTokenService: SendVerificationTokenService,
  ) {}

  async execute(input: { identifier: string; type: VerificationTokenType }): Promise<void> {
    const identity = await this.identityRepo.findByIdentifier(input.identifier);

    // Security: Don't reveal if user exists. Just return if not found.
    if (!identity) return; 
  
    // Specific error for the frontend to redirect to login
    if (identity.verified) {
      throw new BadRequestException('Account is already verified');
    }


    // 2. Save or Upsert the token
    await this.sendVerificationTokenService.sendVerificationToken({
      identityId: identity.id,
      userId: identity.userId,
      type: VerificationTokenType.EMAIL_VERIFY,
      destination: input.identifier,
    });

    // 3. Trigger Notification (Send Email or SMS)
    // await this.notificationService.send(input.identifier, rawOtp);
  }
}