import { Body, Controller, Get, Post, Req, UseGuards  , Patch , Param, Query} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, Role } from 'src/auth/decorators/auth.decorator';
import { UpdateUserDto } from './dto/updateuser.role.dto';

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
  getAllUser(@Query('page') page?: string,
    @Query('limit') limit?: string,) {  
      const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.userService.getAllUser(pageNumber, limitNumber);
  }

  @Post('update-profile')
  updateProfile(@Req() req: any, @Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userService.updateProfile(req.user.id, createUserProfileDto);
  }  

  @Get('find-all-data')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN , Role.EDITOR)
  FindAllData() {
    return this.userService.FindAllData();
  } 

 @Patch('change-user-role/:userId') 
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async ChangeUserData(
    @Param('userId') userId: string, 
    @Body() updateUserDto: UpdateUserDto, 
  ) { 
    return this.userService.ChangeUserData(userId, updateUserDto);
  }
}
