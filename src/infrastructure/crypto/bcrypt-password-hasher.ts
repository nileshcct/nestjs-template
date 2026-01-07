import * as bcrypt from 'bcrypt';
import { appConfig } from 'src/config/app.config';
import { PasswordHasher } from 'src/modules/auth/application/services/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = appConfig.auth.password.saltRounds;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
