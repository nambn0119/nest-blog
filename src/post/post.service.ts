import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  s3 = new S3();

  async upload(fileName: string, avatar: Buffer) {
    try {
      // 			"Sid": "Stmt1700302655631",
      // "Principal": {
      // 	"AWS": "arn:aws:iam::078716642215:user/nhutnam"

      const type = fileName.split('.').pop();
      const uuid = crypto.randomUUID().toString();

      const uploadResult = await this.s3
        .upload({
          Bucket: 'realist-app-image',
          Body: avatar,
          Key: `${uuid}.${type}`,
          ContentType: 'image/png',
          // ContentDisposition: fileName,
          // ACL: 'public-read',
        })
        .promise();
      return uploadResult;
    } catch (error) {
      console.log(error);
    }
  }

  async create(
    userId: number,
    createPostDto: CreatePostDto,
    image: string,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });

    try {
      const res = await this.postRepository.save({
        ...createPostDto,
        user,
        thumbnail: image,
      });
      return await this.postRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException('Error create post', HttpStatus.BAD_REQUEST);
    }
  }
}
