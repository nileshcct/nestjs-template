import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';


@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
   // 1. Create the native driver connection
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    // 2. Pass the adapter to PrismaClient
    super({ adapter });
  }
  
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
