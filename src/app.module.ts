import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth/auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { UserModule } from './users/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
   imports: [
    AuthModule.forRoot({ 
      auth, // Pass the Better Auth instance
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
