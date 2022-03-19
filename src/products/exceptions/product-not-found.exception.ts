import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(productName: string = '') {
    super(`Product ${productName} not found`);
  }
}
