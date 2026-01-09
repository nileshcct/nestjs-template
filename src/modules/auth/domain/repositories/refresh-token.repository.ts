export interface RefreshTokenRepository {
  create(data: {
    sessionId: string;
    userId: string;
    jti: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  revoke(tokenHash: string): Promise<void>;
  findByJti(jti: string): Promise<{
    expiresAt: Date; sessionId: string; userId : string; tokenHash: string; revoked: boolean;
} | null>;
 revokeSession(sessionId: string): Promise<void>;
 deleteByUserId(userId: string): Promise<void>;
}
