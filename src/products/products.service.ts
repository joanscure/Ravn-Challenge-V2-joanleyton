import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { PaginationPrimaDto } from './dto/pagination-prisma.dto';
import { ProductDto } from './dto/product.dto';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(productId: number) {
    return await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async findAll(paginationDto: PaginationPrimaDto) {
    return await this.prismaService.product.findMany({
      skip: paginationDto.skip,
      take: paginationDto.take,
      include: {
        images: true,
        category: true,
      },
    });
  }

  async getByCategory(
    codeCategory: string,
    productName: string,
    paginationDto: PaginationPrimaDto,
  ) {
    return await this.prismaService.product.findMany({
      skip: paginationDto.skip,
      take: paginationDto.take,
      where: {
        category: {
          code: codeCategory,
        },
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

    return await this.prismaService.product.create({
      data: payload,
    });
  }

  async update(productId: number, productDto: ProductDto) {
    try {
      const product = await this.findOne(productId);

      if (!product) throw new ProductNotFoundException(productDto.name);

      const productUpdate = await this.prismaService.product.update({
        where: {
          id: productId,
        },
        data: productDto,
      });
      return productUpdate;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async remove(productId: number) {
    try {
      const product = await this.findOne(productId);

      if (!product) throw new ProductNotFoundException();

      const productDelete = this.prismaService.product.delete({
        where: {
          id: productId,
        },
      });

      return productDelete;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async disableProduct(productId: number) {
    try {
      const product = await this.findOne(productId);

      if (!product) throw new ProductNotFoundException();

      const productDisabled = this.prismaService.product.update({
        where: {
          id: productId,
        },
        data: {
          active: false,
        },
      });

      return productDisabled;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
