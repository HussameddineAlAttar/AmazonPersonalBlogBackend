import {Controller, Post, Get, Body, Param, Delete} from '@nestjs/common';
import { PostDTO } from  '../post/dto/PostDTO';
import {PostQueryResponse} from "./dto/PostQueryResponseDTO";
import {PostService} from "./post.service";
import { PostEntity } from './entity/PostEntity';

@Controller('post')
export class PostController {
  // static postMap = new Map<string, PostDTO>();

  getNextID(posts: PostDTO[]): string{
    let maxID: number = 1;
    posts.forEach(post => {
      let currentID = parseInt(post.id.slice(4));
      if(currentID >= maxID){
        maxID = currentID + 1;
      }
    });
    return 'post' + maxID;
  }

   @Post()
   async createPost(@Body() post: PostDTO){
       console.log('post post request');
       const service = new PostService();
       let allPosts = (await service.getAllPosts()).posts;
       let nextID = this.getNextID(allPosts);

       post.id = nextID;
       service.insert(post);
       console.log("database call pass");
       return  post;
   }

   @Get(':id')
   async getPost(@Param('id') postId: string) : Promise<PostDTO> {
       console.log('hello post get request');
       const service = new PostService();
       const post = new PostDTO();
       post.id = postId;
       return service.get(post);
   }

   @Get()
  async getAllPosts(): Promise<PostQueryResponse> {
    console.log('get all posts request');
    const service = new PostService();
    return service.getAllPosts();
  }

  @Delete()
  async deleteAllPosts(): Promise<void> {
    console.log('delete all posts request');
    const service = new PostService();
    await service.deleteAllPosts();
  }

  @Delete(':id')
  async deletePost(@Param('id') postId: string): Promise<void> {
    console.log('delete all posts request');
    const service = new PostService();
    await service.deletePost(postId);
  }
}