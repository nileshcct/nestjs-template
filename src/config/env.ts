import 'dotenv/config';

/**
 * Require a string env variable.
 * Throws at startup if missing.
 */
export function required(key: string): string {
  const value = process.env[key];

  if (value === undefined || value === '') {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

/**
 * Require a numeric env variable.
 * Parses and validates number.
 */
export function requiredNumber(key: string): number {
  const value = process.env[key];

  if (value === undefined || value === '') {
    throw new Error(`Missing environment variable: ${key}`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      `Invalid number for environment variable: ${key} (got "${value}")`,
    );
  }

  return parsed;
}
