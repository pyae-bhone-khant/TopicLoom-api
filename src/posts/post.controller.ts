import { Controller, Get, Param, Post, Req, ParseIntPipe, Body , UseGuards  } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create.post.dto';
import { UpdatePostDto } from './dtos/update.post.dto'; 
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/decorators/auth.decorator';



@Controller('post') 
export class PostController {
  constructor(private readonly postService: PostService) {} 
  
  @Get()
  findAll(@Req() req: any) {
    return this.postService.findAll(req.user.id);
  } 

  @Get('own-posts')
   @UseGuards(AccessTokenGuard, RolesGuard)
   @Roles(Role.EDITOR)
  findPostByUserId(@Req() req: any) {
    return this.postService.findPostByUserId(req.user.id);
  } 
 
  @Post("like/:postId")
  likePost(@Param('postId' , ParseIntPipe) postId: number, @Req() req: any) {
    return this.postService.likePost(postId.toString(), req.user.id);
  } 

  @Post("create-post")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.EDITOR  , Role.ADMIN ) 
  createPost(@Req() req: any , @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(req.user.id, createPostDto);
  } 
  
  @Post("update-post/:postId")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.EDITOR  , Role.ADMIN ) 
  updatePost(@Param('postId' , ParseIntPipe) postId: number, @Req() req: any , @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(postId.toString(), req.user.id, updatePostDto);
  } 

}
