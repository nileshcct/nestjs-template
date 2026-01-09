import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthCredential } from '../schemas/auth/auth-credentials.schema';
import { AuthCredentialRepository } from 'src/modules/auth/domain/repositories/auth-credential.repository';

export class MongoAuthCredentialRepository
  implements AuthCredentialRepository
{
  constructor(
    @InjectModel(AuthCredential.name)
    private readonly model: Model<AuthCredential>,
  ) {}

  async create(data: {
    userId: string;
    identityId: string;
    passwordHash: string;
  }) {
    await this.model.create({
      userId: new Types.ObjectId(data.userId),
      identityId: new Types.ObjectId(data.identityId),
      passwordHash: data.passwordHash,
    });
  }

  async findByIdentityId(identityId: string) {
    const doc = await this.model.findOne({
      identityId: new Types.ObjectId(identityId),
    });

    return doc ? { passwordHash: doc.passwordHash } : null;
  }
  async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteMany({ userId: new Types.ObjectId(userId) });
  }
}
