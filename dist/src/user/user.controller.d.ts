/// <reference types="multer" />
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterUserDto } from './dto/filter-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(query: filterUserDto): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
}
