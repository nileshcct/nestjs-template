import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from './user.entity';

export interface UserRepository {
  create(data: CreateUserDto): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
