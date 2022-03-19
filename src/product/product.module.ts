import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
