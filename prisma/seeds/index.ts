import fs from 'fs';
import path from 'path';
import { PrismaClient } from 'src/generated/prisma';

export type Seed = {
  name: string;
  run: (prisma: PrismaClient) => Promise<void>;
};

export async function loadSeeds(): Promise<Seed[]> {
  const dir = __dirname;

  const files = fs
    .readdirSync(dir)
    .filter(
      (f) => f.endsWith('.seed.js') && f !== 'index.js'
    )
    .sort(); // deterministic order

  const seeds: Seed[] = [];

  for (const file of files) {
    const mod = await import(path.join(dir, file));

    if (typeof mod.run !== 'function') {
      throw new Error(`${file} must export a run() function`);
    }

    seeds.push({
      name: file,
      run: mod.run,
    });
  }

  return seeds;
}
