import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
export declare class CategoryService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
}
