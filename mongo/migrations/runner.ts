import 'dotenv/config';
import { connect, Schema, model } from 'mongoose';
import { loadMigrations } from './index';


const MigrationSchema = new Schema({
  name: String,
  executedAt: Date,
});

const Migration = model('Migration', MigrationSchema);


/**
 * Runs all migrations in the current directory in a deterministic order.
 *
 * @returns {Promise<void>} A promise resolving when all migrations have been run.
 */
async function run() {
  const migrations = await loadMigrations();
  await connect(process.env.DATABASE_URL!);

  for (const { name, up } of migrations) {
    const alreadyRan = await Migration.findOne({ name });
    if (alreadyRan) continue;

    // const migration = await import(`./${name}`);
    await up();

    await Migration.create({ name, executedAt: new Date() });
    console.log(`Migration ${name} completed`);
  }

  process.exit(0);
}

run();
