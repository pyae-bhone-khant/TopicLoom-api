import { Controller, Get, Param, Post, Req, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post') 
export class PostController {
  constructor(private readonly postService: PostService) {} 
  
  @Get()
  findAll() {
    return this.postService.findAll();
  } 

  @Get('own-posts')
  findPostByUserId(@Req() req: any) {
    return this.postService.findPostByUserId(req.user.id);
  } 
 
  @Post("like/:postId")
  likePost(@Param('postId' , ParseIntPipe) postId: number, @Req() req: any) {
    return this.postService.likePost(postId.toString(), req.user.id);
  }
}
