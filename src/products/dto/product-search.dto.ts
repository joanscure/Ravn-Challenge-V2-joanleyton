import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ProductSearchDto {
  @ApiProperty({
    description: 'Product category id',
  })
  @IsNumberString()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    required: false,
    default: '',
    description: 'Product name to search',
  })
  @IsString()
  productName: string;
}
