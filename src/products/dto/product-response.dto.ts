import { SizeProduct } from '@prisma/client';
import { CategoryDto } from './category.dto';
import { ProductImagesDto } from './product-images.dto';

export class ProductResponseDto {
  name: string;

  size: SizeProduct;

  price: number;

  availableStock?: number;

  description?: string;

  categoryId: number;

  Image?: ProductImagesDto[];

  category: CategoryDto;
}
