import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
export declare class CreatePostDto {
    title: string;
    description: string;
    thumbnail: string;
    status: number;
    user: User;
    category: Category;
}
