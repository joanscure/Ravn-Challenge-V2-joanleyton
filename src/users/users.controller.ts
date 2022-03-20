import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../utils/decorator/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { AddCartDto } from './dto/add-cart.dto';
import { UsersService } from './services/users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @ApiTags('Client')
  @ApiBearerAuth()
  @ApiQuery({ name: 'productId' })
  @Get(':productId/like')
  async likeProduct(
    @Request() { user },
    @Query('productId', ParseIntPipe) productId: number,
  ) {
    return await this.usersServices.likeProduct(user.userId, productId);
  }

  @ApiTags('Client')
  @ApiBearerAuth()
  @Post('add-to-cart')
  async addToCart(@Request() { user }, @Body() addCartDto: AddCartDto) {
    return await this.usersServices.addToCart(user.userId, addCartDto);
  }

  @ApiTags('Client')
  @ApiBearerAuth()
  @Post('buy-products')
  async buyProducts(@Request() { user }) {
    return await this.usersServices.buyProducts(user.userId);
  }

  @ApiTags('Client')
  @ApiBearerAuth()
  @ApiQuery({ name: 'orderId' })
  @Get('order/:orderId')
  async findMyOrder(
    @Request() { user },
    @Query('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.usersServices.findOneOrder(user.userId, orderId);
  }

  @ApiTags('Manager')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('orders')
  async findAllOrders() {
    return await this.usersServices.findAllOrders();
  }
}
