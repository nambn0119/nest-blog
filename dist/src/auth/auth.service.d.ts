import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private config;
    constructor(userRepository: Repository<User>, jwtService: JwtService, config: ConfigService);
    register(registerUserDto: RegisterUserDto): Promise<User>;
    login(loginUserDto: LoginUserDto): Promise<any>;
    refreshToken(refresh_token: string): Promise<any>;
    private generateToken;
    private hashPassword;
}
