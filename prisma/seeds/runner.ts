import 'dotenv/config';
import { loadSeeds } from './index';
import { PrismaClient } from 'src/generated/prisma';

async function seedAll() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined');
  }


  // Explicitly pass the connection string to the constructor
  const prisma = new PrismaClient(
  // Todo - unable to connect to databse issue 
  //   {
  //   datasources: {
  //     db: {
  //       url: process.env.DATABASE_URL,
  //     },
  //   },
  // }
);

  // const prisma = new PrismaClient();

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
