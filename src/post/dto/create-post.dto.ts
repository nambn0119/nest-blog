import { User } from 'src/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  thumbnail: string;
  @IsNotEmpty()
  status: number;
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  category: Category;
}
