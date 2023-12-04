import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
export declare class CategoryController {
    private categorySevice;
    constructor(categorySevice: CategoryService);
    findAll(): Promise<Category[]>;
}
