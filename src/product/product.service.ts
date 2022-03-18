import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async getAllProducts(page: number, itemsPerPage: number) {
    const skip = page * itemsPerPage;

    return await this.prismaService.product.findMany({
      skip: skip,
      take: itemsPerPage,
      include: {
        Images: true,
      },
    });
  }
}
