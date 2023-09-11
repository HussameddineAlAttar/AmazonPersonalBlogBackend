import { Injectable } from '@nestjs/common';
import {PostDTO} from "./dto/PostDTO";
import {DataMapper} from "@aws/dynamodb-data-mapper";
import {PostEntity} from "./entity/PostEntity";
import { PostQueryResponse } from './dto/PostQueryResponseDTO';
import {DynamoDB} from "aws-sdk";

@Injectable()
export class PostService {
   async insert(post: PostDTO): Promise<PostDTO> {
       try {
           const  database = new DataMapper({

               client: new DynamoDB({ endpoint: 'http://localhost:8000',
                   region: 'local' }),
           });
           return await database.put(Object.assign(new PostEntity(),
               {
                   id: post.id,
                   text: post.text,
                   title: post.title,
                   author: post.author,
                   readmoreUrl: post.readmoreUrl,
                   pictureUrl: post.pictureUrl
               }));
       } catch (error) {
           console.log({ error: error.name }, 'Error inserting item');
           throw new Error(error);
       }
   }

   async get(post: PostDTO): Promise<PostDTO> {
       const  database = new DataMapper({

           client: new DynamoDB({ endpoint: 'http://localhost:8000',
               region: 'local' }),
       });

       const postEntity = new PostEntity();
       postEntity.id = post.id;
       return await database.get(postEntity);
   }

   async getAllPosts(): Promise<PostQueryResponse> {
    const database = new DataMapper({
      client: new DynamoDB({
        endpoint: 'http://localhost:8000',
        region: 'local',
      }),
    });

    const scanIterator = database.scan(PostEntity);

    const posts: PostDTO[] = [];
    for await (const item of scanIterator) {
      const post: PostDTO = {
        id: item.id,
        text: item.text,
        title: item.title,
        author: item.author,
        readmoreUrl: item.readmoreUrl,
        pictureUrl: item.pictureUrl,
      };
      posts.push(post);
    }

    const response: PostQueryResponse = {
      posts: posts.sort((a,b) => parseInt(b.id.slice(4)) - parseInt(a.id.slice(4))),
    };
    return response;
  }

  async deleteAllPosts(): Promise<void> {
    const database = new DataMapper({
      client: new DynamoDB({
        endpoint: 'http://localhost:8000',
        region: 'local',
      }),
    });

    const scanIterator = database.scan(PostEntity);

    for await (const item of scanIterator) {
      await database.delete(Object.assign(new PostEntity(), item));
    }
  }

  async deletePost(postId: string): Promise<void> {
    const database = new DataMapper({
      client: new DynamoDB({
        endpoint: 'http://localhost:8000',
        region: 'local',
      }),
    });

    const post = await database.get(Object.assign(new PostEntity(), { id: postId }));

    if (post) {
      await database.delete(post);
    }
  }
}