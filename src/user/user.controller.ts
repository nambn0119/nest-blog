import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'item_per_page' })
  @ApiQuery({ name: 'search' })
  @Get()
  findAll(@Query() query: filterUserDto): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('proflie')
  profile(@Req() req: any): Promise<User> {
    return this.userService.findOne(Number(req.user_data.id));
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Delete('multiple')
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.userService.multipleDelete(ids);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.Delete(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtAll = ['jpg', 'png', 'jpeg'];
        if (!allowedExtAll.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtAll.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Less than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadGatewayException(req.fileValidationError);
    }
    if (!file) {
      throw new BadGatewayException('File is required');
    }
    const res = this.userService.upload(file.originalname, file.buffer);

    res.then((data) => {
      if (data) {
        this.userService.updateAvatar(req.user_data.id, data.Location);
        console.log('==========');
        console.log('errorr upload to db success');
      } else {
        console.log('errorr upload to db');
        throw new BadGatewayException('error upload to db');
        // return false;
      }
    });

    return res;
  }
}
