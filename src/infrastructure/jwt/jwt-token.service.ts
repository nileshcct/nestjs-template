import { randomBytes, randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { TokenService } from 'src/modules/auth/application/services/token.service';
import { appConfig } from 'src/config/app.config';

export class JwtTokenService implements TokenService {
  private readonly accessTokenSecret = appConfig.auth.accessToken.secret;
  private readonly accessTokenExpiresIn = appConfig.auth.accessToken.expiresIn;
  generateAccessToken(payload: {
    sub: string;
    sid: string;
  }): string {
    const secret = this.accessTokenSecret;
    const options: jwt.SignOptions = { expiresIn: this.accessTokenExpiresIn };
    return jwt.sign(payload, secret, options);
  }

  generateRefreshToken(): {
    jti: string;
    rawToken: string;
  } {
   const jti = randomUUID(); // lookup key
  const secret = randomBytes(48).toString('hex'); // entropy
  return {
    jti,
    rawToken: `${jti}.${secret}`,
  };
  }
  

  verifyAccessToken<T = any>(token: string): T {
    const secret = this.accessTokenSecret as jwt.Secret;
    return jwt.verify(token, secret) as T;
  }
}
