import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { VerificationTokenType } from 'src/modules/auth/constants/auth-verification-token-type.enum';

@Injectable()
export class PrismaAuthVerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    identityId: string;
    userId: string;
    type: VerificationTokenType;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.authVerificationToken.create({
      data: {
        identityId: params.identityId,
        userId: params.userId,
        type: params.type,
        tokenHash: params.tokenHash,
        expiresAt: params.expiresAt,
      },
    });
  }

  async findValidByIdentity(
    identityId: string,
    type: VerificationTokenType,
  ) {
    return this.prisma.authVerificationToken.findFirst({
      where: {
        identityId,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findByTokenHash(
    tokenHash: string,
    type: VerificationTokenType,
  ) {
    return this.prisma.authVerificationToken.findFirst({
      where: {
        tokenHash,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markUsed(tokenId: string): Promise<void> {
    await this.prisma.authVerificationToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }

  async invalidateAllForIdentity(
    identityId: string,
    type: VerificationTokenType,
  ): Promise<void> {
    await this.prisma.authVerificationToken.updateMany({
      where: {
        identityId,
        type,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    // assuming identity → user relationship is enforced elsewhere
    await this.prisma.authVerificationToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
