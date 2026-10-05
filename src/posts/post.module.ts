import { Module } from '@nestjs/common';
import { PostService} from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  controllers: [PostController],
  providers: [PostService , PrismaService, AccessTokenGuard, RolesGuard],
})
export class PostModule {}
