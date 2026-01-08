import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RefreshToken } from '../schemas/auth/refresh-token.schema';
import { RefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository';

export class MongoRefreshTokenRepository
  implements RefreshTokenRepository
{
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly model: Model<RefreshToken>,
  ) {}

  async create(data: {
    sessionId: string;
    jti: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    await this.model.create({
      sessionId: new Types.ObjectId(data.sessionId),
      jti: data.jti,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    });
  }

  async revoke(tokenHash: string) {
    await this.model.updateOne(
      { tokenHash },
      { revoked: true },
    );
  }

  async findByJti(jti: string) {
    const doc = await this.model.findOne({ jti });

    return doc
      ? { sessionId: doc.sessionId.toString(), tokenHash: doc.tokenHash, expiresAt: doc.expiresAt, revoked: doc.revoked }
      : null;
  }
  async revokeSession(sessionId: string): Promise<void> {
    await this.model.updateMany(
      { sessionId: new Types.ObjectId(sessionId) },
      { revoked: true },
    );
  }
}
