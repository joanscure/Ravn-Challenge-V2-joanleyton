import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ProductDto } from '../dto/product.dto';
import { SizeProduct } from '../enums/size-product.enum';

@Injectable()
export class ProductsFactory {
  async make(params?: ProductDto) {
    return {
      //id: faker.datatype.number(),
      name: params?.name ?? faker.name.jobDescriptor(),
      size:
        params?.size ??
        faker.random.arrayElement([
          SizeProduct.L,
          SizeProduct.M,
          SizeProduct.S,
          SizeProduct.XL,
        ]),
      price: params?.price ?? faker.datatype.float({ max: 1000 }),
      availableStock:
        params?.availableStock ?? faker.datatype.number({ min: 0 }),
      description: params?.description ?? faker.random.words(),
      categoryId: params?.categoryId ?? faker.random.arrayElement([1, 2, 3]),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  }
}
