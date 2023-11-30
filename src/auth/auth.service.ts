import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    // tao lk voi db User = userRepository
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  // nhan vao tham so tu dto va luu
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerUserDto.password);
    return await this.userRepository.save({
      ...registerUserDto,
      refresh_token: 'refresh_token',
      password: hashPassword,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkpass = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!checkpass) {
      throw new HttpException('wrong pass', HttpStatus.UNAUTHORIZED);
    }
    // generate access
    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.config.get<string>('SECRET'),
      });

      console.log(verify);
      const checlExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });
      if (checlExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException('not found token', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('error token', HttpStatus.BAD_REQUEST);
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    console.log(this.config.get<string>('EXP_IN_REFRESH_TOKEN'));
    console.log(this.config.get<string>('SECRET'));

    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: this.config.get<string>('EXP_IN_REFRESH_TOKEN'),
    });
    this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
