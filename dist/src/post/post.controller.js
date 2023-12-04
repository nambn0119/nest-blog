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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const create_post_dto_1 = require("./dto/create-post.dto");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../user/auth.guard");
const path_1 = require("path");
const post_service_1 = require("./post.service");
const filter_post_dto_1 = require("./dto/filter-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    create(req, createPostDto, file) {
        if (req.fileValidationError) {
            throw new common_1.BadGatewayException(req.fileValidationError);
        }
        if (!file) {
            throw new common_1.BadGatewayException('File is required');
        }
        const res = this.postService.upload(file.originalname, file.buffer);
        return res
            .then((data) => {
            return this.postService.create(req['user_data'].id, createPostDto, data.Location, data.Key);
        })
            .catch((error) => {
            console.log(error);
            throw new common_1.BadGatewayException('Upload image to Aws fail');
        });
    }
    findAll(query) {
        return this.postService.findAll(query);
    }
    findDetail(id) {
        return this.postService.findDetail(id);
    }
    update(id, req, updatePostDto, file) {
        if (req.fileValidationError) {
            throw new common_1.BadGatewayException(req.fileValidationError);
        }
        if (!file) {
            throw new common_1.BadGatewayException('File is required');
        }
        const res = this.postService.deleteImage(id);
        return res.then(async (data) => {
            if (data.DeleteMarker) {
                const newUpdate = this.postService.upload(file.originalname, file.buffer);
                return newUpdate.then((data) => {
                    updatePostDto.key_aws = data.Key;
                    updatePostDto.thumbnail = data.Location;
                    return this.postService.update(id, updatePostDto);
                });
            }
        });
    }
    async delete(id) {
        const res = this.postService.deleteImage(Number(id));
        return res
            .then(() => {
            return this.postService.delete(Number(id));
        })
            .catch((error) => {
            throw new common_1.BadGatewayException('Delete Aws Fail: ', error);
        });
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail', {
        fileFilter: (req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname);
            const allowedExtAll = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtAll.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtAll.toString()}`;
                cb(null, false);
            }
            else {
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = `File size is too large. Less than 5MB`;
                    cb(null, false);
                }
                else {
                    cb(null, true);
                }
            }
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_post_dto_1.FilterPostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "findDetail", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('thumbnail', {
        fileFilter: (req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname);
            const allowedExtAll = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtAll.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtAll.toString()}`;
                cb(null, false);
            }
            else {
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = `File size is too large. Less than 5MB`;
                    cb(null, false);
                }
                else {
                    cb(null, true);
                }
            }
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_post_dto_1.UpdatePostDto, Object]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "delete", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
//# sourceMappingURL=post.controller.js.map