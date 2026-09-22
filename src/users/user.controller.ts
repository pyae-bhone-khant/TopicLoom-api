import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, Role } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Controller('user')
  
export class UserController {
  constructor(private readonly userService: UserService) {} 
 
  @Get('profile')
  @UseGuards(AccessTokenGuard)
  getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.id);
  } 

  @Post('update-profile')
  // @UseGuards(AccessTokenGuard)
  updateProfile(@Req() req: any, @Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userService.updateProfile(req.user.id, createUserProfileDto);
  }
}
