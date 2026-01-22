import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AuthIdentityRepository } from 'src/modules/auth/domain/repositories/auth-identity.repository';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exits.error';
import { isUniqueConstraintViolation } from 'src/infrastructure/errors/db-error.mapper';
import { Injectable } from '@nestjs/common';
import { AuthIdentityType } from 'src/generated/prisma'

@Injectable()
export class PrismaAuthIdentityRepository
  implements AuthIdentityRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    provider: AuthIdentityType;
    providerUserId: string;
  }) {
    try {
      const record = await this.prisma.authIdentity.create({
        data: {
          userId: data.userId,
          provider: data.provider,
          providerUserId: data.providerUserId,
        },
        select: { id: true },
      });

      return { id: record.id };
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new EmailAlreadyExistsError('email');
      }
      throw error;
    }
  }

  async findByProvider(provider: AuthIdentityType, providerUserId: string) {
    const record = await this.prisma.authIdentity.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
    });

    return record
      ? {
          id: record.id,
          userId: record.userId,
          verified: record.verified,
        }
      : null;
  }

  async findByIdentifier(providerUserId: string) {
    const record = await this.prisma.authIdentity.findFirst({
      where: { providerUserId },
    });

    return record
      ? {
          id: record.id,
          userId: record.userId,
          verified: record.verified,
        }
      : null;
  }

  async markVerified(identityId: string) {
    await this.prisma.authIdentity.update({
      where: { id: identityId },
      data: { verified: true },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.authIdentity.deleteMany({
      where: { userId },
    });
  }
}
