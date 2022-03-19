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

  @ApiProperty({
    minimum: 0,
  })
  @Min(0)
  price: number;

  @ApiProperty({
    required: false,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  availableStock?: number;

  @ApiProperty({
    required: false,
    default: '',
  })
  description?: string;

  @ApiProperty()
  @IsNumberString()
  categoryId: number;
}
