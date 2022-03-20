import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsNumberString, IsOptional} from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Current page',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  itemsPerPage?: number;
}
