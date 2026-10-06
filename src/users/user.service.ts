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
    const user = users , userLength : number = users.length;
    return { user, userLength };
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
}