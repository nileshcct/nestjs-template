export interface AuthIdentityRepository {
  create(data: {
    userId: string;
    provider: string;
    providerUserId: string;
  }): Promise<{ id: string }>;

  findByProvider(
    provider: string,
    providerUserId: string,
  ): Promise<{ id: string; userId: string, verified: boolean } | null>;
  findByIdentifier(
    providerUserId: string,
  ): Promise<{ id: string; userId: string, verified: boolean } | null>;

  markVerified(identityId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
