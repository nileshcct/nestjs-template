import { UserEntity } from "./domain/user.entity";
export class UserMapper {
  static toEntity(raw: any): UserEntity {
    const { _id, __v, ...rest } = raw;
    return {
      id: _id?.toString() ?? rest.id,
      ...rest,
    };
  }

  static toPublic(entity: UserEntity) {
    const { passwordHash, ...safe } = entity;
    return safe;
  }
}
