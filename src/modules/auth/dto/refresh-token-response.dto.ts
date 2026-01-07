
export class RefreshTokenResponseDto {
  sessionId: string;
  tokenHash: string;
  revoked : boolean;
  expiresAt : Date;
  createdAt : Date;
  updatedAt : Date;
}