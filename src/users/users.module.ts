import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServices } from './users.services';

@Module({
  imports: [],
  providers: [UsersServices],
  controllers: [UsersController],
})
export class UsersModule {}
