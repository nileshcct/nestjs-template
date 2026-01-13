import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AuthSessionRepository } from 'src/modules/auth/domain/repositories/auth-session.repository';

@Injectable()
export class PrismaAuthSessionRepository
  implements AuthSessionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    const record = await this.prisma.authSession.create({
      data: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
      },
      select: { id: true },
    });

    return { id: record.id };
  }

  async revoke(sessionId: string) {
    await this.prisma.authSession.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

  async findById(sessionId: string) {
    const record = await this.prisma.authSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    return record ? { userId: record.userId } : null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.authSession.deleteMany({
      where: { userId },
    });
  }
}
