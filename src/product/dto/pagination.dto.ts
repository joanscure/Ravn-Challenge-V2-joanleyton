import { ApiProperty } from '@nestjs/swagger';
import {IsNumber} from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 0,
    description: 'Current page',
    required: false,
    minimum: 0,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    default: 10,
    description: 'Number of items per page',
    required: false,
    minimum: 1,
  })
  @IsNumber()
  itemsPerPage: number;
}
