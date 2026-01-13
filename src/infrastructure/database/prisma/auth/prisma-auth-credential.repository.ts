import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthCredentialRepository } from 'src/modules/auth/domain/repositories/auth-credential.repository';

@Injectable()
export class PrismaAuthCredentialRepository
  implements AuthCredentialRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    identityId: string;
    passwordHash: string;
  }): Promise<void> {
    await this.prisma.authCredential.create({
      data: {
        userId: data.userId,
        identityId: data.identityId,
        passwordHash: data.passwordHash,
      },
    });
  }

  async findByIdentityId(identityId: string) {
    const record = await this.prisma.authCredential.findFirst({
      where: { identityId },
      select: { passwordHash: true },
    });

    return record ?? null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.authCredential.deleteMany({
      where: { userId },
    });
  }
}
