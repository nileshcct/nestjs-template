import * as passwordHasher from '../services/password-hasher';
import { AUTH_CREDENTIAL_REPOSITORY, AUTH_IDENTITY_REPOSITORY, AUTH_REPOSITORY, PASSWORD_HASHER, USER_REPOSITORY } from 'src/infrastructure/database/database.constants';
import { Inject } from '@nestjs/common';
import { RegisterDto } from '../../dto/register.dto';
import { ConflictException } from '@nestjs/common';
import * as authIdentityRepository from '../../domain/repositories/auth-identity.repository';
import * as authCredentialRepository from '../../domain/repositories/auth-credential.repository';
import { UsersService } from 'src/modules/users/users.service';

export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    @Inject(AUTH_IDENTITY_REPOSITORY) private readonly identityRepo: authIdentityRepository.AuthIdentityRepository,
    @Inject(AUTH_CREDENTIAL_REPOSITORY) private readonly credentialRepo: authCredentialRepository.AuthCredentialRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: passwordHasher.PasswordHasher,
  ) {}

  async execute(registerDto: RegisterDto) {
    const existing = await this.identityRepo.findByProvider('EMAIL',registerDto.email);
     if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Create user (business entity)
     const user = await this.usersService.createUser({
       name : registerDto.name,
       age: registerDto.age,
    });
    if (!user.id) {
      throw new ConflictException('User creation failed');
    }

    // Create auth identity 
    // created two recors
    const identity = await this.identityRepo.create({
      userId: user.id,
      provider: 'EMAIL',
      providerUserId: registerDto.email,
    });

    const passwordHash = await this.passwordHasher.hash(registerDto.password);
    
    // Store credentials
    await this.credentialRepo.create({
      identityId: identity.id,
      passwordHash,
    });

    // Return safe response
    return {
      userId: user.id,
    };
  }
}
