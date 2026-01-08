import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import type {UserRepository} from 'src/modules/users/domain/user.repository';
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
   */
  async getUser(id: string) {
    return await this.userRepo.findById(id);
  }
  /**
   * Creates a new user in the database. This is used in auth module during registration process
   */
  async createUser(dto: CreateUserDto) {
     return this.userRepo.create(dto);
  }

  /**
   * Updates an existing user in the database.
   */
  async updateUser(id: string, dto: UpdateUserDto) {
    // Ensure user exists (repository will throw UserNotFoundError if not)
    await this.userRepo.findById(id);
    return await this.userRepo.update(id, dto);
  }

  /**
   * Deletes a user from the database.
   */
  async deleteUser(id: string) {
    // This will throw UserNotFoundError if not found
    await this.userRepo.findById(id);
    return await this.userRepo.delete(id);
  }
}