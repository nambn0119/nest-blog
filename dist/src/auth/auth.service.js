"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, config) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(registerUserDto) {
        const hashPassword = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({
            ...registerUserDto,
            refresh_token: 'refresh_token',
            password: hashPassword,
        });
    }
    async login(loginUserDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email },
        });
        if (!user) {
            throw new common_1.HttpException('Email is not exist', common_1.HttpStatus.UNAUTHORIZED);
        }
        const checkpass = bcrypt.compareSync(loginUserDto.password, user.password);
        if (!checkpass) {
            throw new common_1.HttpException('wrong pass', common_1.HttpStatus.UNAUTHORIZED);
        }
        const payload = { id: user.id, email: user.email };
        return this.generateToken(payload);
    }
    async refreshToken(refresh_token) {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.config.get('SECRET'),
            });
            console.log(verify);
            const checlExistToken = await this.userRepository.findOneBy({
                email: verify.email,
                refresh_token,
            });
            if (checlExistToken) {
                return this.generateToken({ id: verify.id, email: verify.email });
            }
            else {
                throw new common_1.HttpException('not found token', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException('error token', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateToken(payload) {
        console.log(this.config.get('EXP_IN_REFRESH_TOKEN'));
        console.log(this.config.get('SECRET'));
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.config.get('SECRET'),
            expiresIn: this.config.get('EXP_IN_REFRESH_TOKEN'),
        });
        this.userRepository.update({ email: payload.email }, { refresh_token: refresh_token });
        return { access_token, refresh_token };
    }
    async hashPassword(password) {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map