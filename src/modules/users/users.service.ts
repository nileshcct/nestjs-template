import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import type {UserRepository} from 'src/modules/users/domain/user.repository';
import { mapUserDomainError } from 'src/modules/users/domain/errors/user-error.mapper';
import { USER_REPOSITORY } from 'src/infrastructure/database/database.constants';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}
    /**
   * Retrieves a user by ID.
   * @throws {NotFoundException} if the user is not found.
   */
  async getUser(id: string) {
    try {
      return await this.userRepo.findById(id);
    } catch (err) {
      mapUserDomainError(err);
    }
  }
  /**
   * Creates a new user in the database. This is used in auth module during registration process
   * @throws {ConflictException} if the email already exists.
   * @throws {NotFoundException} if the user is not found.
   */
  async createUser(dto: CreateUserDto) {
    try {
      return await this.userRepo.create(dto);
    } catch (err) {
      mapUserDomainError(err);
    }
  }

  /**
   * Updates an existing user in the database.
   * @throws {NotFoundException} if the user is not found.
   */
  async updateUser(id: string, dto: UpdateUserDto) {
    try {
      return await this.userRepo.update(id, dto);
    } catch (err) {
      mapUserDomainError(err);
    }
  }

  /**
   * Deletes a user from the database.
   * @throws {NotFoundException} if the user is not found.
   */
  async deleteUser(id: string) {
    try {
      return await this.userRepo.delete(id);
    } catch (err) {
      mapUserDomainError(err);
    }
  }
}