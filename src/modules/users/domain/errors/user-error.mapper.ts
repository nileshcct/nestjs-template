import { ConflictException, NotFoundException } from '@nestjs/common';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exits.error';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';

export function mapUserDomainError(err: unknown): never {
  if (err instanceof EmailAlreadyExistsError) {
    throw new ConflictException('Email already exists');
  }

  if (err instanceof UserNotFoundError) {
    throw new NotFoundException('User not found');
  }

  throw err; // let global filter handle it
}
