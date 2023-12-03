import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';

export class UpdatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  thumbnail: string;
  @IsNotEmpty()
  status: number;
  @IsNotEmpty()
  key_aws: string;

  @IsNotEmpty()
  category: Category;
}
