import { ApiProperty } from '@nestjs/swagger';

export class filterUserDto {
  @ApiProperty()
  page: string;
  @ApiProperty()
  item_per_page: string;
  @ApiProperty()
  search: string;
}
