export interface AuthCredentialRepository {
  create(data: {
    identityId: string;
    passwordHash: string;
  }): Promise<void>;

  findByIdentityId(
    identityId: string,
  ): Promise<{ passwordHash: string } | null>;
}
