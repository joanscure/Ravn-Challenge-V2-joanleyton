import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from '@prisma/client';
import { AddCartDto } from '../dto/add-cart.dto';
import { prisma } from '../../prisma/prisma';
import { ProductsService } from '../../products/services/products.service';
import faker from '@faker-js/faker';

@Injectable()
export class UsersService {
  constructor(private readonly productsService: ProductsService) {}

  async likeProduct(id: number, productId: number) {
    const alreadyReacted = await this.existsReaction(id, productId);

    if (alreadyReacted) {
      throw new ConflictException(
        'The user has already reacted to this product',
      );
    }

    const userReaction = prisma.userReaction.create({
      data: {
        productId: productId,
        userId: id,
      },
    });
    return userReaction;
  }
  async existsReaction(id: number, productId: number) {
    const record = await prisma.userReaction.findFirst({
      where: {
        productId: productId,
        userId: id,
      },
    });
    return !!record;
  }

  async addToCart(id: number, addCartDto: AddCartDto) {
    const cartProduct = await prisma.cart.findFirst({
      where: {
        userId: id,
        productId: Number.parseInt(addCartDto.productId, 10),
      },
    });
    const product = await this.productsService.existProduct(
      Number.parseInt(addCartDto.productId, 10),
    );
    if (!product) throw new NotFoundException('product not found');

    await this.registerToCart(id, cartProduct, addCartDto);

    return {
      message: 'Product has been added to your cart',
    };
  }

  async registerToCart(id: number, cartProduct: Cart, addCartDto?: AddCartDto) {
    if (cartProduct) {
      cartProduct.quantity += addCartDto.quantity;
      cartProduct.totalAmount = cartProduct.quantity * cartProduct.price;
      await prisma.cart.update({
        data: cartProduct,
        where: {
          id: cartProduct.id,
        },
      });
    } else {
      await prisma.cart.create({
        data: {
          userId: id,
          productId: Number.parseInt(addCartDto.productId, 10),
          price: addCartDto.price,
          quantity: addCartDto.quantity,
          totalAmount: addCartDto.price * addCartDto.quantity,
        },
      });
    }
  }

  async buyProducts(id: number) {
    const cart = await prisma.cart.findMany({
      where: {
        userId: id,
      },
    });
    if (!cart.length)
      throw new ConflictException('There are no items in the cart');
    const now = new Date();
    const totalAmount: number = cart.reduce(
      (sum: number, element: Cart) => sum + element.totalAmount,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId: id,
        date: now,
        totalAmount: totalAmount,
      },
    });

    const payloadOrderDetails = cart.map((element) => {
      return {
        subtotal: element.totalAmount,
        productId: element.productId,
        price: element.price,
        quantity: element.quantity,
        orderId: order.id,
      };
    });
    await prisma.orderDetail.createMany({
      data: payloadOrderDetails,
    });

    await prisma.cart.deleteMany({
      where: {
        userId: id,
      },
    });

    return {
      message: 'Successful order',
    };
  }

  async findOneOrder(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({
      where: {
        userId: userId,
        id: orderId,
      },
      include: {
        details: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    return order;
  }
  async getAnyUser() {
    const user = await prisma.user.findFirst();
    if (!user)
      return await prisma.user.create({
        data: {
          username: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: faker.internet.password(6),
          email: faker.internet.email(),
          role: 'ADMIN',
        },
      });
    return user;
  }

  async getAnyOrder() {
    const order = await prisma.order.findFirst();
    return order;
  }

  async findAllOrders() {
    return await prisma.order.findMany({
      include: {
        user: true,
        details: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }
}
