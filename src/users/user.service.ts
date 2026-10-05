import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
  async getProfile(userId: string) {
      const user = await this.prisma.user.findUnique({
       where: {
         id: userId
       } ,
       select: {
         id: true,
         email: true,
         name: true,
         role: true,
         image: true,
         bio: true 
       }
     });
      return user;
  }

  async getAllUserProfile() {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'EDITOR'],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        bio: true,
      },
    });
    return users;
  }

  async updateProfile(userId: string, updateUserDto: CreateUserProfileDto) { 
   
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name,
        bio: updateUserDto.bio,
        image: updateUserDto.image,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        bio: true,
      },
    });
    return user;
  } 

  async getAllUser() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        bio: true
      }
    });
    return users;
  }
}