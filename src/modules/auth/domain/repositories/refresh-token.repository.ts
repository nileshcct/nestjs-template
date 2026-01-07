export interface RefreshTokenRepository {
  create(data: {
    sessionId: string;
    jti: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  revoke(tokenHash: string): Promise<void>;
  findByJti(jti: string): Promise<{
    expiresAt: Date; sessionId: string; tokenHash: string; revoked: boolean;
} | null>;
}
