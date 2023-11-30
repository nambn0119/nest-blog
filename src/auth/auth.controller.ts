import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Login fail' })
  @UsePipes(ValidationPipe)
  login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    console.log(loginUserDto);
    return this.authService.login(loginUserDto);
  }

  @Post('refresh_token')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    console.log('refresh_token');
    return this.authService.refreshToken(refresh_token);
  }
}
