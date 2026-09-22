import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Required for Neon serverless connections in Node.js
neonConfig.webSocketConstructor = ws;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    
    // Pass the configuration directly to PrismaNeon 
    // instead of creating a `new Pool()` instance first
    const adapter = new PrismaNeon({ connectionString });
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}