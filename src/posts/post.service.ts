import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) {}
 async findAll(currentUserId: string) { 
    try {
       const posts = await this.prisma.post.findMany({
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
                    role: true, 
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
                            role : true
                        }
                    }
                } 
            },
            createdAt: true,
            updatedAt: true,
        }
       }); 
     const post = posts.map((post) => ({
           ...post,
           likeCount: post.likes.length , 
           isLiked: post.likes.some(like => like.user.id === currentUserId)
       }));

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
                    role: true,
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

  async likePost(postId: string, userId: string) {
    const existingLike = await this.prisma.postLike.findFirst({
      where: {
        postId: parseInt(postId),
        userId: userId
      }
    });
    if (existingLike) {
      const unlike = await this.prisma.postLike.delete({
        where: {
          postId_userId: {
            postId: existingLike.postId,
            userId: existingLike.userId
          }
        }
      });
      return unlike;
    } else { 
        const like = await this.prisma.postLike.create({
          data: {
            postId: parseInt(postId),
            userId: userId
          }
        });
        return like;
    }
  }
}
