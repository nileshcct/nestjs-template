import 'dotenv/config';
import { loadSeeds } from './index';
import { PrismaClient } from 'src/generated/prisma';
// import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';


async function seedAll() {
  // const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not defined');
  }

   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);


  // Explicitly pass the connection string to the constructor
  const prisma = new PrismaClient({
  adapter,
});

  try {
    const seeds = await loadSeeds();

    for (const seed of seeds) {
      console.log(`Running ${seed.name}`);
      await seed.run(prisma);
    }

    console.log('Seeding complete');
  } finally {
    await prisma.$disconnect();
  }
}

seedAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
