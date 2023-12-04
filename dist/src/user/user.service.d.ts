/// <reference types="node" />
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterUserDto } from './dto/filter-user.dto';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private userRepository;
    private config;
    constructor(userRepository: Repository<User>, config: ConfigService);
    s3: S3;
    findAll(query: filterUserDto): Promise<any>;
    findOne(id: number): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult>;
    Delete(id: number): Promise<DeleteResult>;
    upload(fileName: string, avatar: Buffer): Promise<S3.ManagedUpload.SendData>;
    updateAvatar(id: number, avatar: string): Promise<UpdateResult>;
}
