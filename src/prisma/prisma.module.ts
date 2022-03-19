import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.services';

@Global()
@Module({
  imports: [],
  providers: [PrismaService],
  controllers: [],
  exports: [PrismaService],
})
export class PrismaModule {}
