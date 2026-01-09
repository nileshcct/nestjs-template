import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthSession } from '../schemas/auth/auth-session.schema';
import { AuthSessionRepository } from 'src/modules/auth/domain/repositories/auth-session.repository';

export class MongoAuthSessionRepository
  implements AuthSessionRepository
{
  constructor(
    @InjectModel(AuthSession.name)
    private readonly model: Model<AuthSession>,
  ) {}

  async create(data: {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    const doc = await this.model.create({
      userId: new Types.ObjectId(data.userId),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      expiresAt: data.expiresAt,
    });

    return { id: doc._id.toString() };
  }

  async revoke(sessionId: string) {
    await this.model.updateOne(
      { _id: new Types.ObjectId(sessionId) },
      { isRevoked: true },
    );
  }

  async findById(sessionId: string) {
    const doc = await this.model.findById(
      new Types.ObjectId(sessionId),
    );

    return doc
      ? { userId: doc.userId.toString() }
      : null;
  }
  async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteMany({ userId: new Types.ObjectId(userId) });
  }
}
