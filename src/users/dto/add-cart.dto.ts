import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class AddCartDto {
  @ApiProperty()
  @IsNumberString()
  productId: number;

  @ApiProperty({
    minimum: 1,
  })
  quantity: number;

  @ApiProperty()
  price: number;
}
