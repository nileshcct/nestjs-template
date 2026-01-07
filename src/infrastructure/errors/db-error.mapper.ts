export function isUniqueConstraintViolation(
  err: any,
  field?: string,
): boolean {
  // Mongo
  if (err?.code === 11000) return true;

  // Postgres / MySQL
  if (err?.code === '23505') return true;

  // Prisma
  if (err?.code === 'P2002') return true;

  return false;
}
