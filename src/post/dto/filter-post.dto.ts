import { IsNotEmpty } from 'class-validator';

export class FilterPostDto {
  @IsNotEmpty()
  page: string;
  @IsNotEmpty()
  item_per_page: string;
  @IsNotEmpty()
  search: string;

  category: string;
}
