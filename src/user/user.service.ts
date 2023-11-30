import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterUserDto } from './dto/filter-user.dto';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private config: ConfigService,
  ) {}

  s3 = new S3();

  async findAll(query: filterUserDto): Promise<any> {
    const item_per_page = Number(query.item_per_page) || 10;
    const page = Number(query.page) || 1;
    const keyword = query.search || '';

    const skip = (page - 1) * item_per_page;
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },
      ],
      order: { created_at: 'DESC' }, // giam dan
      take: item_per_page,
      skip: skip,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });
    const lastPage = Math.ceil(total / item_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prePage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prePage,
      lastPage,
    };
  }
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    user.password = undefined;
    user.refresh_token = undefined;
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save(createUserDto);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async Delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

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

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar });
  }
}
