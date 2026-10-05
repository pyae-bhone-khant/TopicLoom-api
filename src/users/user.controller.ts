import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, Role } from 'src/auth/decorators/auth.decorator';

@Controller('user')
  
export class UserController {
  constructor(private readonly userService: UserService) {} 
 
  @Get('profile')
  @UseGuards(AccessTokenGuard)
  getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.id); 
  } 

  @Get('GetAll-UserProfile')
  getAllUserProfile() {
    return this.userService.getAllUserProfile();
  } 

  @Get('All-user')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllUser() { 
    return this.userService.getAllUser();
  }

  @Post('update-profile')
  // @UseGuards(AccessTokenGuard)
  updateProfile(@Req() req: any, @Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userService.updateProfile(req.user.id, createUserProfileDto);
  } 
}
