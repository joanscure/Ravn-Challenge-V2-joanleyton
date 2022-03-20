import { ConflictException, Injectable } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { PayloadJWTDto } from '../jwt/dto/payload-jwt.dto';
import { PrismaService } from '../prisma/prisma.services';
import { AddCartDto } from './dto/add-cart.dto';

@Injectable()
export class UsersServices {
  constructor(private readonly prismaService: PrismaService) {}

  async likeProduct(id: number, productId: number) {
    const alreadyReacted = await this.existsReaction(id, productId);

    if (alreadyReacted) {
      throw new ConflictException(
        'The user has already reacted to this product',
      );
    }

    const userReaction = this.prismaService.userReaction.create({
      data: {
        productId: productId,
        userId: id,
      },
    });
    return userReaction;
  }
  async existsReaction(id: number, productId: number) {
    const record = await this.prismaService.userReaction.findFirst({
      where: {
        productId: productId,
        userId: id,
      },
    });
    return !!record;
  }

  async addToCart(id: number, addCartDto: AddCartDto) {
    const cartProduct = await this.prismaService.cart.findFirst({
      where: {
        userId: id,
        productId: addCartDto.productId,
      },
    });

    await this.registerToCart(id, cartProduct, addCartDto);

    return {
      message: 'Product has been added to your cart',
    };
  }

  async registerToCart(id: number, cartProduct: Cart, addCartDto?: AddCartDto) {
    if (cartProduct) {
      cartProduct.quantity += addCartDto.quantity;
      cartProduct.totalAmount = cartProduct.quantity * cartProduct.price;
      await this.prismaService.cart.update({
        data: cartProduct,
        where: {
          id: cartProduct.id,
        },
      });
    } else {
      await this.prismaService.cart.create({
        data: {
          userId: id,
          productId: addCartDto.productId,
          price: addCartDto.price,
          quantity: addCartDto.quantity,
          totalAmount: addCartDto.price * addCartDto.quantity,
        },
      });
    }
  }

  async buyProducts(user: PayloadJWTDto) {
    const cart = await this.prismaService.cart.findMany({
      where: {
        userId: user.sub,
      },
    });
    if (!cart.length)
      throw new ConflictException('There are NO items in the cart');
    const now = new Date();
    const totalAmount: number = cart.reduce(
      (sum: number, element: Cart) => sum + element.totalAmount,
      0,
    );

    const order = await this.prismaService.order.create({
      data: {
        userId: user.sub,
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
    await this.prismaService.orderDetail.createMany({
      data: payloadOrderDetails,
    });

    return {
      message: 'Successful order',
    };
  }

  async findOneOrder(user: PayloadJWTDto, orderId: number) {
    return await this.prismaService.order.findFirst({
      where: {
        userId: user.sub,
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
  }

  async findAllOrders() {
    return await this.prismaService.order.findMany({
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
