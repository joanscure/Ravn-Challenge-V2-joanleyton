import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './dto/pagination.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductDto } from './dto/product.dto';
import ProductAlreadyExistsException from './exceptions/product-already-exists.exception';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { prisma } from '../prisma/prisma';

@Injectable()
export class ProductsService {
  async findOne(productId: number) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        active: true,
      },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return plainToInstance(ProductResponseDto, product);
  }

  async existProduct(productId: number): Promise<boolean> {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    return !!product;
  }

  async existsOneByName(productName: string): Promise<boolean> {
    if (!productName.length) return false;

    const product = await prisma.product.findFirst({
      where: {
        name: productName,
      },
    });

    return !!product;
  }

  async findAll(paginationDto: PaginationDto) {
    const arrayProducts = await prisma.product.findMany({
      skip: paginationDto.page * paginationDto.itemsPerPage,
      take: paginationDto.itemsPerPage,
      include: {
        images: true,
        category: true,
      },
    });
    return arrayProducts;
  }

  async getByCategory(
    categoryId: number,
    productName: string,
    paginationDto: PaginationDto,
  ) {
    return await prisma.product.findMany({
      skip: paginationDto.page * paginationDto.itemsPerPage,
      take: paginationDto.itemsPerPage,
      where: {
        category: {
          id: categoryId,
        },
        active: true,
        name: {
          contains: productName,
          mode: 'insensitive',
        },
      },
      include: {
        images: true,
      },
    });
  }

  async create(productDto: ProductDto) {
    const availableStock = productDto.availableStock ?? 0;
    const payload = { ...productDto, active: true, availableStock };

    const existsProduct = await this.existsOneByName(productDto.name);
    if (existsProduct) throw new ProductAlreadyExistsException('name');

    try {
      return await prisma.product.create({
        data: payload,
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(productId: number, productDto: ProductDto) {
    const product = await this.existProduct(productId);

    if (!product) throw new ProductNotFoundException(productDto.name);

    try {
      const productUpdate = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name: productDto.name,
          size: productDto.size,
          price: productDto.price,
          availableStock: productDto.availableStock,
          description: productDto.description,
          categoryId: productDto.categoryId,
        },
      });

      return productUpdate;
    } catch (err) {
      console.log('err :>> ', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async remove(productId: number) {
    const product = await this.existProduct(productId);

    if (!product) throw new ProductNotFoundException();

    try {
      const productDelete = prisma.product.delete({
        where: {
          id: productId,
        },
      });

      return productDelete;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async disableProduct(productId: number) {
    const product = await this.existProduct(productId);

    if (!product) throw new ProductNotFoundException();

    try {
      const productDisabled = prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          active: false,
        },
      });

      return productDisabled;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadsImages(productId: number, images: Array<Express.Multer.File>) {
    const productsImages = images.map((image) => {
      return {
        urlImage: image.destination + '/' + image.filename,
        productId: productId,
      };
    });

    try {
      return await prisma.productImage.createMany({
        data: productsImages,
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
