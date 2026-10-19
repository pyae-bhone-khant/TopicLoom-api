import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dtos/create.post.dto';
import { UpdatePostDto } from './dtos/update.post.dto';

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
            featuredImageUrl: true,
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
           isLiked: post.likes.some(like => like.user.id === currentUserId),
           postLength: post.content.length
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
            featuredImageUrl: true,
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

  async createPost(userId: string, createPostDto: CreatePostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          authorId: userId,
          title: createPostDto.title,
          slug: createPostDto.slug || createPostDto.title.toLowerCase().replace(/ /g, '-'),
          content: createPostDto.content,
          featuredImageUrl: createPostDto.featuredImageUrl,
          status: createPostDto.status || 'PUBLISHED' as any
        }
      });
      return post;
    } catch (error) {
      throw error;
    } 
  }  
  
  async updatePost(postId: string, userId: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.prisma.post.update({
        where: {
          id: parseInt(postId)
        },
        data: {
          title: updatePostDto.title,
          slug: updatePostDto.slug || updatePostDto.title?.toLowerCase().replace(/ /g, '-'),
          content: updatePostDto.content,
          featuredImageUrl: updatePostDto.featuredImageUrl,
          status: updatePostDto.status || 'PUBLISHED' as any
        }
      });
      return post;
    } catch (error) {
      throw error;
    } 
  } 

  
}
