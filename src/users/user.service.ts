import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserDto } from './dto/updateuser.role.dto';

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

 async getAllUser(page: number = 1, limit: number = 10) {
    // page နံပါတ်အပေါ် မူတည်ပြီး ဘယ်နခု ကျော်ရမလဲ (skip) ကို တွက်ချက်ခြင်း
    const skip = (page - 1) * limit;

    // အသုံးပြုသူ အားလုံးရဲ့ စုစုပေါင်း အရေအတွက်ကိုပါ တစ်ခါတည်း တွက်ချက်ရန်
    const [users, userLength] = await Promise.all([
      this.prisma.user.findMany({
        skip: skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          bio: true,
        },
      }),
      this.prisma.user.count(), // စုစုပေါင်း user အရေအတွက်
    ]);

    return {
      users,
      meta: {
        total: userLength,
        page,
        limit,
        totalPages: Math.ceil(userLength / limit),
      },
    };
  }
  
async FindAllData() {
    // Promise.all ကိုသုံးပြီး Database Query ၅ ခုကို တပြိုင်နက်တည်း အလုပ်လုပ်ခိုင်းပါမယ်
    const [
      totalUsers, 
      totalPosts, 
      totalEditors, 
      latestUsers, 
      latestPosts
    ] = await Promise.all([
      // ၁။ User အားလုံးရဲ့ အရေအတွက်ကို ရေတွက်မယ်
      this.prisma.user.count(),

      // ၂။ Post အားလုံးရဲ့ အရေအတွက်ကို ရေတွက်မယ်
      this.prisma.post.count(),

      // ၃။ Editor အရေအတွက်ကို ရေတွက်မယ်
      this.prisma.user.count({ where: { role: 'EDITOR' } }),

      // ၄။ နောက်ဆုံးဝင်ထားတဲ့ User ၄ ယောက်ကိုပဲ ဆွဲထုတ်မယ်
      this.prisma.user.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' }, // အသစ်ဆုံးကို အပေါ်ဆုံးက ယူဖို့
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          role: true,
        }
      }),

      // ၅။ နောက်ဆုံးတင်ထားတဲ့ Post ၄ ခုကိုပဲ ဆွဲထုတ်မယ်
      this.prisma.post.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' }, // (Post table မှာ createdAt ရှိတယ်လို့ ယူဆပါတယ်)
        select: {
          title: true,
          authorId: true,
          createdAt: true, // Dashboard မှာ အချိန်ပြဖို့ လိုအပ်ရင် ထည့်ပါ
          author: {
            select: {
              name: true,
              image: true,
            }
          }
        }
      })
    ]);

    return { 
      user: latestUsers, 
      post: latestPosts, 
      userLength: totalUsers, 
      postLength: totalPosts, 
      editorLength: totalEditors 
    };
  }
  
  async ChangeUserData(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: updateUserDto.role,
      },
    });
  }
}