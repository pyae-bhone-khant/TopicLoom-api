// class-validator ကို သုံးဖို့ import လုပ်ပါမယ်
import { IsEnum, IsNotEmpty } from 'class-validator';

// Prisma သို့မဟုတ် Project ထဲမှာ သတ်မှတ်ထားတဲ့ Role Enum
export enum Role {
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SUBSCRIBER = 'SUBSCRIBER',
}

export class UpdateUserDto {
  // role မပါဘဲ လှမ်းပို့တာမျိုးကို တားဆီးဖို့
  @IsNotEmpty({ message: 'Role is required' }) 
  
  // သတ်မှတ်ထားတဲ့ Role ၄ ခုထဲက ဟုတ်/မဟုတ် စစ်ဆေးဖို့
  @IsEnum(Role, {
    message: 'Role must be either AUTHOR, ADMIN, EDITOR, or SUBSCRIBER',
  })
  role: Role;
}