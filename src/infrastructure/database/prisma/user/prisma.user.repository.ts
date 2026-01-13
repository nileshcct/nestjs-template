import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { UserRepository } from 'src/modules/users/domain/user.repository';
import { UserEntity } from 'src/modules/users/domain/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserMapper } from 'src/modules/users/users.mapper';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: dto,
    });

    return UserMapper.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return UserMapper.toPublic(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map(UserMapper.toPublic);
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: user,
      });

      return UserMapper.toPublic(updated);
    } catch {
      throw new UserNotFoundError(id);
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByTokenHash(hash: string): Promise<UserEntity | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });

    return token ? UserMapper.toPublic(token.user) : null;
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
