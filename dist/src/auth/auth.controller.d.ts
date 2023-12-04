import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerUserDto: RegisterUserDto): Promise<User>;
    login(loginUserDto: LoginUserDto): Promise<any>;
    refreshToken({ refresh_token }: {
        refresh_token: any;
    }): Promise<any>;
}
