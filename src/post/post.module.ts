import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Category]),
    ConfigModule.forRoot(),
    S3,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
