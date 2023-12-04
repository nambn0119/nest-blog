/// <reference types="multer" />
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostController {
    private postService;
    constructor(postService: PostService);
    create(req: any, createPostDto: CreatePostDto, file: Express.Multer.File): Promise<PostEntity>;
    findAll(query: FilterPostDto): Promise<any>;
    findDetail(id: number): Promise<PostEntity>;
    update(id: number, req: any, updatePostDto: UpdatePostDto, file: Express.Multer.File): Promise<import("typeorm").UpdateResult>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
