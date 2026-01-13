import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { RefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository';

@Injectable()
export class PrismaRefreshTokenRepository
  implements RefreshTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    sessionId: string;
    userId: string;
    jti: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        sessionId: data.sessionId,
        userId: data.userId,
        jti: data.jti,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async revoke(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async findByJti(jti: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { jti },
    });

    return record
      ? {
          sessionId: record.sessionId,
          userId: record.userId,
          tokenHash: record.tokenHash,
          expiresAt: record.expiresAt,
          revoked: record.revoked,
        }
      : null;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { sessionId },
      data: { revoked: true },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
