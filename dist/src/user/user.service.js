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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    constructor(userRepository, config) {
        this.userRepository = userRepository;
        this.config = config;
        this.s3 = new aws_sdk_1.S3();
    }
    async findAll(query) {
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const keyword = query.search || '';
        const skip = (page - 1) * item_per_page;
        const [res, total] = await this.userRepository.findAndCount({
            where: [
                { first_name: (0, typeorm_2.Like)('%' + keyword + '%') },
                { last_name: (0, typeorm_2.Like)('%' + keyword + '%') },
                { email: (0, typeorm_2.Like)('%' + keyword + '%') },
            ],
            order: { created_at: 'DESC' },
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
    async findOne(id) {
        const user = await this.userRepository.findOneBy({ id });
        user.password = undefined;
        user.refresh_token = undefined;
        return user;
    }
    async create(createUserDto) {
        const hashPassword = bcrypt.hash(createUserDto.password, 10);
        return await this.userRepository.save(createUserDto);
    }
    async update(id, updateUserDto) {
        return await this.userRepository.update(id, updateUserDto);
    }
    async Delete(id) {
        return await this.userRepository.delete(id);
    }
    async upload(fileName, avatar) {
        try {
            const type = fileName.split('.').pop();
            const uuid = crypto.randomUUID().toString();
            const uploadResult = await this.s3
                .upload({
                Bucket: 'realist-app-image',
                Body: avatar,
                Key: `${uuid}.${type}`,
                ContentType: 'image/png',
            })
                .promise();
            return uploadResult;
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateAvatar(id, avatar) {
        return await this.userRepository.update(id, { avatar });
    }
    async multipleDelete(ids) {
        return await this.userRepository.delete({ id: (0, typeorm_2.In)(ids) });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map