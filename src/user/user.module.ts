import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule.forRoot(), S3],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
