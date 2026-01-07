import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthIdentity } from '../schemas/auth/auth-identity.schema';
import { AuthIdentityRepository } from 'src/modules/auth/domain/repositories/auth-identity.repository';

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
    const doc = await this.model.create({
      userId: new Types.ObjectId(data.userId),
      provider: data.provider,
      providerUserId: data.providerUserId,
    });

    return { id: doc._id.toString() };
  }

  async findByProvider(provider: string, providerUserId: string) {
    const doc = await this.model.findOne({ provider, providerUserId });
    return doc
      ? { id: doc._id.toString(), userId: doc.userId.toString() }
      : null;
  }
}
