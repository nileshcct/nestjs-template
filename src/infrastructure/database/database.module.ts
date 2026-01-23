
import { DynamicModule, Module } from '@nestjs/common';
import { MongoDatabaseModule } from './mongo/mongo.module';
import {PrismaDatabaseModule} from './prisma/prisma.module';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const databaseType = process.env.DATABASE_TYPE?.toLowerCase() || 'mongo';
    console.log('databaseType :>> ', databaseType);
    let imports: any[] = [];
    let exports: any[] = [];

    if (databaseType === 'mongo') {
      imports = [MongoDatabaseModule];
      exports = [MongoDatabaseModule]; // Export the whole module
    } 
    else if (databaseType === 'postgres') {
      imports = [PrismaDatabaseModule];
      exports = [PrismaDatabaseModule]; // Export the whole module
    }
     else {
      throw new Error(`Unsupported DATABASE_TYPE: ${databaseType}. Supported: mongo, postgres`);
    }

    return {
      module: DatabaseModule,
      imports,
      exports, // Export the DB-specific module, NOT the token
      global: true, // Optional: make it global if you want auto-import everywhere
    };
  }
}