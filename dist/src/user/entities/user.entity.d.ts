import { Post } from 'src/post/entities/post.entity';
export declare class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    avatar: string;
    refresh_token: string;
    status: number;
    created_at: Date;
    updated_at: Date;
    posts: Post[];
}
