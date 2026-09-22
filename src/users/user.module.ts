import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AccessTokenGuard, RolesGuard],
})
export class UserModule {}
