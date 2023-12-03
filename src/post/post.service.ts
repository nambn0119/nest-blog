import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
// import S3 from 'aws-sdk/clients/s3.js';

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
          ACL: 'public-read',
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
    key_aws: string,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });

    try {
      const res = await this.postRepository.save({
        ...createPostDto,
        user,
        thumbnail: image,
        key_aws,
      });
      return await this.postRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException('Error create post', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: FilterPostDto): Promise<any> {
    const item_per_page = Number(query.item_per_page) || 10;
    const page = Number(query.page) || 1;
    const search = Number(query.search) || '';
    const skip = (page - 1) * item_per_page;
    const category = Number(query.category) || null;

    const [res, total] = await this.postRepository.findAndCount({
      where: [
        {
          title: Like('%' + search + '%'),
          category: {
            id: category,
          },
        },
        {
          description: Like('%' + search + '%'),
          category: {
            id: category,
          },
        },
      ],
      order: { created_at: 'DESC' },
      take: item_per_page,
      skip: skip,
      relations: {
        user: true,
        category: true,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
        },
      },
    });

    const lastPage = Math.ceil(total / item_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prePage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      lastPage,
      prePage,
    };
  }

  async findDetail(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
      select: {
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
      },
    });
  }

  async deleteImage(id: number) {
    try {
      const key = await this.postRepository.findOne({
        where: { id },
        select: {
          key_aws: true,
        },
      });

      return await this.s3
        // .deleteObject({
        //   Bucket: 'realist-app-image',
        //   Key: `797ccf1a-2d1e-49a7-aebe-caddbb66dbb1.jpeg`,
        // })
        .deleteObject({
          Bucket: 'realist-app-image',
          Key: `${key.key_aws}`,
        })
        .promise()
        .catch((error) => {
          throw new BadGatewayException('Delete fail to aws: ', error);
        });
    } catch (error) {
      throw new BadGatewayException('Delete fail to aws');
    }
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postRepository.update(id, updatePostDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.postRepository.delete(id);
  }
}

// {
// 	"Version": "2012-10-17",
// 	"Id": "Policy1700302672850",
// 	"Statement": [
// 		{
// 			"Sid": "PublicRead",  // PublicReadGetObject
// 			"Effect": "Allow",
// 			"Principal": "*",
// 			"Action": [
// 			    "s3:GetObject",
// 			],
// 			"Resource": "arn:aws:s3:::realist-app-image/*"
// 		}
// 	]
// }
