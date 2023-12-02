import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Put,
  Delete,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/user/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtAll = ['.jpg', '.png', '.jpeg'];
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
  create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // upload aws
    if (req.fileValidationError) {
      throw new BadGatewayException(req.fileValidationError);
    }
    if (!file) {
      throw new BadGatewayException('File is required');
    }
    const res = this.postService.upload(file.originalname, file.buffer);

    return res
      .then((data) => {
        return this.postService.create(
          req['user_data'].id,
          createPostDto,
          data.Location,
          data.Key,
        );
      })
      .catch((error) => {
        console.log(error);
        throw new BadGatewayException('Upload image to Aws fail');
      });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterPostDto): Promise<any> {
    return this.postService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findDetail(@Param('id') id: number): Promise<PostEntity> {
    return this.postService.findDetail(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtAll = ['.jpg', '.png', '.jpeg'];
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
  update(
    @Param('id') id: number,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadGatewayException(req.fileValidationError);
    }
    if (!file) {
      throw new BadGatewayException('File is required');
    }
    const res = this.postService.deleteImage(id);

    return res.then(async (data) => {
      if (data.DeleteMarker) {
        // update
        const newUpdate = this.postService.upload(
          file.originalname,
          file.buffer,
        );
        return newUpdate.then((data) => {
          updatePostDto.key_aws = data.Key;
          updatePostDto.thumbnail = data.Location;
          return this.postService.update(id, updatePostDto);
        });
      }
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    // delete aws
    const res = this.postService.deleteImage(Number(id));

    return res
      .then(() => {
        return this.postService.delete(Number(id));
      })
      .catch((error) => {
        throw new BadGatewayException('Delete Aws Fail: ', error);
      });
  }
}
