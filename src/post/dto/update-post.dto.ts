import { IsNotEmpty } from 'class-validator';

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
}
