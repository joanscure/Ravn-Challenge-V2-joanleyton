import { Module } from '@nestjs/common';
import {ProductsModule} from 'src/products/products.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ProductsModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
