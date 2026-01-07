
/* JWT is not mentioned and Payload is explicit
Refresh token generation is separated, Works with:JWT, Paseto, Custom token system
 */
export interface TokenService {
  generateAccessToken(payload: {
    sub: string;
    sid: string;
  }): string;

  generateRefreshToken(): {
    jti: string;
    rawToken: string;
  } ;

  verifyAccessToken<T = any>(token: string): T;
}
