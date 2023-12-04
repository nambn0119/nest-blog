import { Post } from 'src/post/entities/post.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    status: number;
    created_at: Date;
    update_at: Date;
    posts: Post[];
}
