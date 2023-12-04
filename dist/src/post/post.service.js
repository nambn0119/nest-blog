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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const post_entity_1 = require("./entities/post.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
let PostService = class PostService {
    constructor(userRepository, postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.s3 = new aws_sdk_1.S3();
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
                ACL: 'public-read',
            })
                .promise();
            return uploadResult;
        }
        catch (error) {
            console.log(error);
        }
    }
    async create(userId, createPostDto, image, key_aws) {
        const user = await this.userRepository.findOneBy({ id: userId });
        try {
            const res = await this.postRepository.save({
                ...createPostDto,
                user,
                thumbnail: image,
                key_aws,
            });
            return await this.postRepository.findOneBy({ id: res.id });
        }
        catch (error) {
            throw new common_1.HttpException('Error create post', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query) {
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = Number(query.search) || '';
        const skip = (page - 1) * item_per_page;
        const category = Number(query.category) || null;
        const [res, total] = await this.postRepository.findAndCount({
            where: [
                {
                    title: (0, typeorm_2.Like)('%' + search + '%'),
                    category: {
                        id: category,
                    },
                },
                {
                    description: (0, typeorm_2.Like)('%' + search + '%'),
                    category: {
                        id: category,
                    },
                },
            ],
            order: { created_at: 'DESC' },
            take: item_per_page,
            skip: skip,
            relations: {
                user: true,
                category: true,
            },
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true,
                },
                category: {
                    id: true,
                    name: true,
                },
            },
        });
        const lastPage = Math.ceil(total / item_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prePage = page - 1 < 1 ? null : page - 1;
        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            lastPage,
            prePage,
        };
    }
    async findDetail(id) {
        return await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'category'],
            select: {
                category: {
                    id: true,
                    name: true,
                },
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true,
                },
            },
        });
    }
    async deleteImage(id) {
        try {
            const key = await this.postRepository.findOne({
                where: { id },
                select: {
                    key_aws: true,
                },
            });
            return await this.s3
                .deleteObject({
                Bucket: 'realist-app-image',
                Key: `${key.key_aws}`,
            })
                .promise()
                .catch((error) => {
                throw new common_1.BadGatewayException('Delete fail to aws: ', error);
            });
        }
        catch (error) {
            throw new common_1.BadGatewayException('Delete fail to aws');
        }
    }
    async update(id, updatePostDto) {
        return await this.postRepository.update(id, updatePostDto);
    }
    async delete(id) {
        return await this.postRepository.delete(id);
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PostService);
//# sourceMappingURL=post.service.js.map