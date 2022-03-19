import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtGlobalModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, JwtGlobalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
