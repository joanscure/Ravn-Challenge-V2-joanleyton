import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Min,
} from 'class-validator';
import { SizeProduct } from '../enums/size-product.enum';

export class ProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: SizeProduct,
  })
  size: SizeProduct;

  @ApiProperty()
  @Min(0)
  price: number;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @Min(0)
  availableStock?: number;

  @ApiProperty({
    required: false,
  })
  description?: string;

  @ApiProperty()
  @IsNumberString()
  categoryId: number;
}
