import { Controller, Get, Param, Post, Req, ParseIntPipe, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create.post.dto';
import { UpdatePostDto } from './dtos/update.post.dto';

@Controller('post') 
export class PostController {
  constructor(private readonly postService: PostService) {} 
  
  @Get()
  findAll(@Req() req: any) {
    return this.postService.findAll(req.user.id);
  } 

  @Get('own-posts')
  findPostByUserId(@Req() req: any) {
    return this.postService.findPostByUserId(req.user.id);
  } 
 
  @Post("like/:postId")
  likePost(@Param('postId' , ParseIntPipe) postId: number, @Req() req: any) {
    return this.postService.likePost(postId.toString(), req.user.id);
  } 

  @Post("create-post")
  createPost(@Req() req: any , @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(req.user.id, createPostDto);
  } 
  
  @Post("update-post/:postId")
  updatePost(@Param('postId' , ParseIntPipe) postId: number, @Req() req: any , @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(postId.toString(), req.user.id, updatePostDto);
  }
}
