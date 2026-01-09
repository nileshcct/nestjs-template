export interface AuthSessionRepository {
  create(data: {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<{ id: string }>;

  revoke(sessionId: string): Promise<void>;

  findById(sessionId: string): Promise<{ userId: string } | null>;
  deleteByUserId(userId: string): Promise<void>;
}
