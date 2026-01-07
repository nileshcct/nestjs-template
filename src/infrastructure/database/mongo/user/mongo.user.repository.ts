import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from 'src/modules/users/domain/user.repository';
import { UserEntity } from 'src/modules/users/domain/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User, UserDocument } from 'src/infrastructure/database/mongo/schemas/user/user.schema';
import { UserMapper } from 'src/modules/users/users.mapper';
import { isUniqueConstraintViolation } from 'src/infrastructure/errors/db-error.mapper';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exits.error';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';

export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.userModel.create(dto);
      return UserMapper.toEntity(user.toObject());
    } catch (err) {
      if (isUniqueConstraintViolation(err)) {
        throw new EmailAlreadyExistsError('email');
      }
      throw err;
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new UserNotFoundError(id);
      }
      return user ? UserMapper.toPublic(user.toObject()) : null;
    } catch (err) {
      throw err;
    }
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.userModel.findOne({ email });
      return user ? UserMapper.toPublic(user.toObject()) : null;
    } catch (err) {
      throw err;
    }
  }
  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.userModel.find();
      return users.map(UserMapper.toPublic);
    } catch (err) {
      throw err;
    }
  }
  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true });
      if (!updatedUser) {
        throw new UserNotFoundError(id);
      }
      return UserMapper.toPublic(updatedUser.toObject());
    } catch (err) {
      throw err;
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }
  async findByTokenHash(hash: string): Promise<UserEntity | null> {
    try {
      const user = await this.userModel.findOne({ 'tokens.hash': hash });
      return user ? UserMapper.toPublic(user.toObject()) : null;
    } catch (err) {
      throw err;
    }
  }
  async revokeToken(tokenId: string): Promise<void> {
    try {
      await this.userModel.updateOne(
        { 'tokens.id': tokenId },
        { $set: { 'tokens.$.revoked': true } },
      );
    } catch (err) {
      throw err;
    }
  }
  async revokeAllForUser(userId: string): Promise<void> {
    try {
      await this.userModel.updateMany(
        { 'tokens.userId': userId },
        { $set: { 'tokens.$.revoked': true } },
      );
    } catch (err) {
      throw err;
    }
  }
}
