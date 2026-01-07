import { VerificationTokenType } from '../../constants/auth-verification-token-type.enum';

export interface AuthVerificationTokenRepository {
  create(data: {
    identityId: string;
    type: VerificationTokenType;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  /**
   * Find a valid (not used, not expired) token by hash + type
   */
  findValidByTokenHash(
    tokenHash: string,
    type: VerificationTokenType,
  ): Promise<{
    id: string;
    identityId: string;
    type: VerificationTokenType;
    expiresAt: Date;
  } | null>;

  /**
   * Invalidate (mark used) a single token
   */
  markUsed(tokenId: string): Promise<void>;

  /**
   * Invalidate all active tokens for an identity + type
   * (used on resend or state change)
   */
  invalidateAllForIdentity(
    identityId: string,
    type: VerificationTokenType,
  ): Promise<void>;
  findValidByIdentity(
    identityId: string,
    type: VerificationTokenType) : 
    Promise<{
      id : string
      identityId : string,
      type : string,
      tokenHash : string
      expiresAt:Date,
    }>
}
