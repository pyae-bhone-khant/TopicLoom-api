import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) {}
 async findAll() { 
    try {
       const post = await this.prisma.post.findMany({
        select: {
            id: true,
            title: true,
            content: true, 
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }, 
            likes: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            },
            createdAt: true,
            updatedAt: true,
        }
       });
       return post;
    } catch (error) {
       throw error;
    }
  }

  async findPostByUserId(userId: string) {
    try {
       const post = await this.prisma.post.findMany({
        where: {
            authorId: userId
        },
        select: {
            id: true,
            title: true,
            content: true, 
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }, 
            likes: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            },
            createdAt: true,
            updatedAt: true,
        }
       });
       return post;
    } catch (error) {
       throw error;
    }
  }
}
