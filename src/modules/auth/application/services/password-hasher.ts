
/* Works with bcrypt / argon2 / scrypt, Works in tests (fake hasher) */
export interface PasswordHasher {
  hash(value: string): Promise<string>;
  compare(value: string, hashedValue: string): Promise<boolean>;
}
