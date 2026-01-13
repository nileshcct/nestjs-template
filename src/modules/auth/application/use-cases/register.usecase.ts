import * as passwordHasher from '../services/password-hasher';
import { AUTH_CREDENTIAL_REPOSITORY, AUTH_IDENTITY_REPOSITORY, AUTH_REPOSITORY, AUTH_VERIFICATION_TOKEN_REPOSITORY, PASSWORD_HASHER, SEND_VERIFICATION_TOKEN_SERVICE, USER_REPOSITORY } from 'src/infrastructure/database/database.constants';
import { Inject } from '@nestjs/common';
import { RegisterDto } from '../../dto/register.dto';
import { ConflictException } from '@nestjs/common';
import * as authIdentityRepository from '../../domain/repositories/auth-identity.repository';
import * as authCredentialRepository from '../../domain/repositories/auth-credential.repository';
import { UsersService } from 'src/modules/users/users.service';
import { AuthIdentityType } from '../../constants/auth-identity.type.enum';
import { VerificationTokenType } from '../../constants/auth-verification-token-type.enum';
import  { SendVerificationTokenService } from '../services/send-verification-token.service';

export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    @Inject(AUTH_IDENTITY_REPOSITORY) private readonly identityRepo: authIdentityRepository.AuthIdentityRepository,
    @Inject(AUTH_CREDENTIAL_REPOSITORY) private readonly credentialRepo: authCredentialRepository.AuthCredentialRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
    @Inject(SEND_VERIFICATION_TOKEN_SERVICE) private readonly sendVerificationTokenService: SendVerificationTokenService,
  ) {}

  async execute(registerDto: RegisterDto) {
    const existing = await this.identityRepo.findByProvider(AuthIdentityType.EMAIL,registerDto.email);
     if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Create user
     const user = await this.usersService.createUser({
       name : registerDto.name,
       age: registerDto.age,
    });
    if (!user.id) {
      throw new ConflictException('User creation failed');
    }

    // Create auth identity, created two records if login allowed via two method like email and phone
    const identity = await this.identityRepo.create({
      userId: user.id,
      provider: AuthIdentityType.EMAIL,
      providerUserId: registerDto.email,
    });

    const passwordHash = await this.passwordHasher.hash(registerDto.password);
    
    // Store credentials
    await this.credentialRepo.create({
      userId: user.id,
      identityId: identity.id,
      passwordHash,
    });

      await this.sendVerificationTokenService.sendVerificationToken({
      identityId: identity.id,
      userId: user.id,
      type: VerificationTokenType.EMAIL_VERIFY,
      destination: registerDto.email,
    });

    // Return safe response
    return {
      userId: user.id,
      verificationRequired: true,
    };
  }
}
