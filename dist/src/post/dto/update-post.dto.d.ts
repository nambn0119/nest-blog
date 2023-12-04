import { Category } from 'src/category/entities/category.entity';
export declare class UpdatePostDto {
    title: string;
    description: string;
    thumbnail: string;
    status: number;
    key_aws: string;
    category: Category;
}
