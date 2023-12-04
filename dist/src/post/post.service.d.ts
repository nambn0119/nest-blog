/// <reference types="node" />
import { S3 } from 'aws-sdk';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostService {
    private userRepository;
    private postRepository;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>);
    s3: S3;
    upload(fileName: string, avatar: Buffer): Promise<S3.ManagedUpload.SendData>;
    create(userId: number, createPostDto: CreatePostDto, image: string, key_aws: string): Promise<Post>;
    findAll(query: FilterPostDto): Promise<any>;
    findDetail(id: number): Promise<Post>;
    deleteImage(id: number): Promise<import("aws-sdk/lib/request").PromiseResult<S3.DeleteObjectOutput, import("aws-sdk").AWSError>>;
    update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
