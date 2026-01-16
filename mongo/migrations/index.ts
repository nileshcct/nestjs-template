import fs from 'fs';
import path from 'path';

export async function loadMigrations() {
  const migrationsDir = __dirname;

  const files = fs
    .readdirSync(migrationsDir)
    .filter(
      (file) =>
        file.endsWith('.migrate.js') && file !== 'index.js'
    )
    .sort(); // important: deterministic order

  const migrations: { name: string; up: Function }[] = [];

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const migration = await import(filePath);

    if (!migration.up) {
      throw new Error(`Migration ${file} does not export an up() function`);
    }

    migrations.push({
      name: file,
      up: migration.up,
    });
  }

  return migrations;
}
