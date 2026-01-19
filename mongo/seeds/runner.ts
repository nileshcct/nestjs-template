import dotenv from 'dotenv';
dotenv.config();

import { connect, disconnect } from 'mongoose';
import { loadSeeds } from './index';

async function seedAll() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined');
  }

  await connect(process.env.DATABASE_URL!);

  const seeds = await loadSeeds();

  for (const seed of seeds) {
    console.log(`Running ${seed.name}`);
    await seed.run(); // sequential & deterministic
  }

  await disconnect();
  console.log('Seeding complete');
}

seedAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
