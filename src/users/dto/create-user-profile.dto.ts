import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
