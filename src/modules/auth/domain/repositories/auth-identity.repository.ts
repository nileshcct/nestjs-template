export interface AuthIdentityRepository {
  create(data: {
    userId: string;
    provider: string;
    providerUserId: string;
  }): Promise<{ id: string }>;

  findByProvider(
    provider: string,
    providerUserId: string,
  ): Promise<{ id: string; userId: string } | null>;
}
