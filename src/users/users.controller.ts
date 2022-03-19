import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { AddCartDto } from './dto/add-cart.dto';
import { UsersServices } from './users.services';

@Controller('user')
export class UsersController {
  constructor(private readonly usersServices: UsersServices) {}

  @ApiTags('Client')
  @ApiBearerAuth()
  @ApiQuery({ name: 'productId' })
  @Get('like-product/:productId')
  async likeProduct(@Request() { user }, @Query('productId') { productId }) {
    return await this.usersServices.likeProduct(user, productId);
  }

  @ApiTags('Client')
  @ApiBearerAuth()
  @Post('add-to-cart')
  async addToCart(@Request() { user }, @Body() addCartDto: AddCartDto) {
    return await this.usersServices.addToCart(user, addCartDto);
  }

  @ApiTags('Client')
  @ApiBearerAuth()
  @Get('buy-products')
  async buyProducts(@Request() { user }) {
    return await this.usersServices.buyProducts(user);
  }

  @ApiTags('Client')
  @ApiBearerAuth()
  @ApiQuery({ name: 'orderId' })
  @Get('find-my-order/:orderId')
  async findMyOrder(@Request() { user }, @Query('orderId') { orderId }) {
    return await this.usersServices.findOneOrder(user, orderId);
  }

  @ApiTags('Manager')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('find-all-orders')
  async findAllOrders() {
    return await this.usersServices.findAllOrders();
  }
}
