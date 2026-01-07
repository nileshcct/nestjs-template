import type { SignOptions } from 'jsonwebtoken';
import { required, requiredNumber } from './env';

export const authConfig = {
  // JWT
  accessToken: {
    secret: required('JWT_ACCESS_SECRET'),
    expiresIn: '15m' as SignOptions['expiresIn'],
  },
  // Refresh Token
  refreshToken: {
    secret: required('JWT_REFRESH_SECRET'),
    expiresIn: '7d' as SignOptions['expiresIn'],
    ttlMs: 1000 * 60 * 60 * 24 * 7, // 7 days (DB)
  },

  // Session
  session: {
    ttlMs: 1000 * 60 * 60 * 24 * 30, // 30 days
  },

  // Password hashing
  password: {
    saltRounds: 10,
  },
} as const;
