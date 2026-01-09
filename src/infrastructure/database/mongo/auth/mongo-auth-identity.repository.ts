import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthIdentity } from '../schemas/auth/auth-identity.schema';
import { AuthIdentityRepository } from 'src/modules/auth/domain/repositories/auth-identity.repository';
import { isUniqueConstraintViolation } from 'src/infrastructure/errors/db-error.mapper';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exits.error';

export class MongoAuthIdentityRepository
  implements AuthIdentityRepository
{
  constructor(
    @InjectModel(AuthIdentity.name)
    private readonly model: Model<AuthIdentity>,
  ) {}

  async create(data: {
    userId: string;
    provider: string;
    providerUserId: string;
  }) {
    try {
      const doc = await this.model.create({
        userId: new Types.ObjectId(data.userId),
        provider: data.provider,
        providerUserId: data.providerUserId,
      });
      return { id: doc._id.toString() };
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new EmailAlreadyExistsError('email');
      }
      throw error;
    }
  }

  async findByProvider(provider: string, providerUserId: string) {
    const doc = await this.model.findOne({ provider, providerUserId });
    return doc
      ? { id: doc._id.toString(), userId: doc.userId.toString(), verified : doc.verified }
      : null;
  }
  async findByIdentifier( providerUserId: string) {
    const doc = await this.model.findOne({ providerUserId });
    return doc
      ? { id: doc._id.toString(), userId: doc.userId.toString(), verified : doc.verified }
      : null;
  }
  async markVerified(identityId: string) {
    await this.model.updateOne(
      { _id: new Types.ObjectId(identityId) },
      { $set: { verified: true } },
    );
  }
  async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteMany({ userId: new Types.ObjectId(userId) });
  }
}
