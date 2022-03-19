import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtGlobalModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductsModule,
    JwtGlobalModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
