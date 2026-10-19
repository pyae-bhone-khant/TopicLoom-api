import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth/auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { UserModule } from './users/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './posts/post.module';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';

@Module({
   imports: [
    AuthModule.forRoot({ 
      auth, // Pass the Better Auth instance
    }),
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: BigIntInterceptor,
    },
  ],
})
export class AppModule {}
