import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthVerificationToken } from '../schemas/auth/auth-verification-token.schema';
import { VerificationTokenType } from 'src/modules/auth/constants/auth-verification-token-type.enum';

@Injectable()
export class MongoAuthVerificationTokenRepository {
  constructor(
    @InjectModel(AuthVerificationToken.name)
    private readonly model: Model<AuthVerificationToken>,
  ) {}

  async create(params: {
    identityId: Types.ObjectId;
    userId: Types.ObjectId;
    type: VerificationTokenType;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<AuthVerificationToken> {
    return this.model.create({
      identityId: params.identityId,
      userId: params.userId,
      type: params.type,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
    });
  }

  async findValidByIdentity(
    identityId: Types.ObjectId,
    type: VerificationTokenType,
  ): Promise<AuthVerificationToken | null> {
    return this.model.findOne({
      identityId,
      type,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  async findByTokenHash(
    tokenHash: string,
    type: VerificationTokenType,
  ): Promise<AuthVerificationToken | null> {
    return this.model.findOne({
      tokenHash,
      type,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  async markUsed(tokenId: Types.ObjectId): Promise<void> {
    await this.model.updateOne(
      { _id: tokenId },
      { $set: { usedAt: new Date() } },
    );
  }

  async invalidateAllForIdentity(
    identityId: Types.ObjectId,
    type: VerificationTokenType,
  ): Promise<void> {
    await this.model.updateMany(
      {
        identityId,
        type,
        usedAt: null,
      },
      { $set: { usedAt: new Date() } },
    );
  }
  async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteMany({ userId: new Types.ObjectId(userId) });
  }
}
