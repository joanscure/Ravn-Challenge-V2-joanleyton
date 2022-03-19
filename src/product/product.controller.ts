import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/utils/decorator/public.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { Role } from 'src/utils/enums/role.enum';
import { ProductDto } from './dto/product.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { PaginationPrimaDto } from './dto/pagination-prisma.dto';
import { ProductoIdParamDto } from './dto/product-id-param.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

//@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags('Product')
  @Public()
  @Get(':id')
  async findOne(@Param() { id }: ProductoIdParamDto) {
    return await this.productService.findOne(id);
  }

  @ApiTags('Product')
  @Public()
  @Get('all')
  async getAll(@Query() { page = 0, itemsPerPage = 10 }: PaginationDto) {
    const paginatioPrismaDto: PaginationPrimaDto = {
      skip: page * itemsPerPage,
      take: itemsPerPage,
    };

    return await this.productService.findAll(paginatioPrismaDto);
  }

  @ApiTags('Product')
  @Public()
  @Get(':categoryId/:productName')
  async getByCategory(
    @Param() { categoryId, productName = '' }: ProductSearchDto,
    @Query() { page = 0, itemsPerPage = 10 }: PaginationDto,
  ) {
    const paginatioPrismaDto: PaginationPrimaDto = {
      skip: page * itemsPerPage,
      take: itemsPerPage,
    };

    return await this.productService.getByCategory(
      categoryId,
      productName,
      paginatioPrismaDto,
    );
  }

  @ApiTags('Admin user')
  @Roles(Role.Admin)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @Post()
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @ApiTags('Admin user')
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param() { id }: ProductoIdParamDto,
    @Body() productDto: ProductDto,
  ) {
    return await this.productService.update(id, productDto);
  }

  @ApiTags('Admin user')
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param() { id }: ProductoIdParamDto) {
    return await this.productService.remove(id);
  }

  @ApiTags('Admin user')
  @Roles(Role.Admin)
  @Put('disable/:id')
  async disableProduct(@Param() { id }: ProductoIdParamDto) {
    return await this.productService.disableProduct(id);
  }
}
