import { IsEmail, IsString } from 'class-validator';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class GetAllUserDto extends CreateUserProfileDto {
  @IsString()
  @IsEmail()
  email: string;
}
