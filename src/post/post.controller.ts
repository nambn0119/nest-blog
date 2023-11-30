import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/user/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';

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
        );
      })
      .catch((error) => {
        console.log(error);
        throw new BadGatewayException('Upload image to Aws fail');
      });
  }

  @Get()
  findAll(@Query() query: any): Promise<any> {
    return '';
  }
}
