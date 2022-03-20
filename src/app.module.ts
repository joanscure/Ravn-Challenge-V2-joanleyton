import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { JwtGlobalModule } from './jwt/jwt.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    JwtGlobalModule,
    UsersModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
