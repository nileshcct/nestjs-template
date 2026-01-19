import 'dotenv/config';
import { connect, Schema, model } from 'mongoose';
import { loadMigrations } from './index';

const direction = process.argv[2]; // up | down

if (!direction || !['up', 'down'].includes(direction)) {
  console.error('Usage: npm run mongo:migrate up|down');
  process.exit(1);
}

const MigrationSchema = new Schema({
  name: { type: String, unique: true },
  executedAt: Date,
});

const Migration = model('Migration', MigrationSchema);

async function run() {
  await connect(process.env.DATABASE_URL!);

  type MigrationType = { name: string; up: Function; down?: Function };
  const migrations: MigrationType[] = await loadMigrations();

  if (direction === 'up') {
    for (const { name, up } of migrations) {
      const alreadyRan = await Migration.findOne({ name });
      if (alreadyRan) continue;

      await up();
      await Migration.create({ name, executedAt: new Date() });

      console.log(`Migration ${name} applied`);
    }
  }
  if (direction === 'down') {
    // rollback in reverse order
    const executed = await Migration.find().sort({ executedAt: -1 });

    for (const record of executed) {
      const migration = migrations.find(m => m.name === record.name);
      if (!migration?.down) continue;

      await migration.down();
      await Migration.deleteOne({ name: record.name });

      console.log(`Migration ${record.name} rolled back`);
    }
  }

  console.log(`Mongo migrations ${direction} completed`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
