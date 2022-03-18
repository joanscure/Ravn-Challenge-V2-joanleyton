import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from 'src/auth/jwt/constants';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.services';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    ProductService,
    PrismaService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
