import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations';
@table ('Posts')
export class PostEntity {
   @hashKey()
   id: string;
   @attribute()
   text: string;
   @attribute()
   author: string;
   @attribute()
   title: string;
   @attribute()
   readmoreUrl?: string;
   @attribute()
   pictureUrl?: string;
}