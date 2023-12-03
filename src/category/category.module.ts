import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Category } from './entities/category.entity';
import { ConfigModule } from '@nestjs/config';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Category]),
    ConfigModule.forRoot(),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
