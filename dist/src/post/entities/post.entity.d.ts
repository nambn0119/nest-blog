import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Post {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    key_aws: string;
    status: number;
    created_at: Date;
    updated_at: Date;
    user: User;
    category: Category;
}
