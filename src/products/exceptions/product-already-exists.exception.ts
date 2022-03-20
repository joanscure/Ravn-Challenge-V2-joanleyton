import { ConflictException } from '@nestjs/common';

class ProductAlreadyExistsException extends ConflictException {
  constructor(singleField: string) {
    super(`Product already exists with same ${singleField}`);
  }
}

export default ProductAlreadyExistsException;
