export interface AuthCredentialRepository {
  create(data: {
    userId: string;
    identityId: string;
    passwordHash: string;
  }): Promise<void>;

  findByIdentityId(
    identityId: string,
  ): Promise<{ passwordHash: string } | null>;
  deleteByUserId(userId: string): Promise<void>;
}
