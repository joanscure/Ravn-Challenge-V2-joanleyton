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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from 'src/utils/decorator/public.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { Role } from 'src/utils/enums/role.enum';
import { ProductDto } from './dto/product.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { ProductoIdParamDto } from './dto/product-id-param.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto } from './dto/file-upload.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @ApiTags('User')
  @Public()
  @Get(':id')
  async findOne(@Param() { id }: ProductoIdParamDto) {
    return await this.productService.findOne(id);
  }

  @ApiTags('User')
  @Public()
  @Get('all')
  async getAll(@Query() { page = 0, itemsPerPage = 10 }: PaginationDto) {
    return await this.productService.findAll({ page, itemsPerPage });
  }

  @ApiTags('User')
  @Public()
  @Get(':categoryId/:productName')
  async getByCategory(
    @Param() { categoryId, productName = '' }: ProductSearchDto,
    @Query() { page = 0, itemsPerPage = 10 }: PaginationDto,
  ) {
    return await this.productService.getByCategory(categoryId, productName, {
      page,
      itemsPerPage,
    });
  }

  @ApiTags('Manager')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @Post()
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @ApiTags('Manager')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  async update(
    @Param() { id }: ProductoIdParamDto,
    @Body() productDto: ProductDto,
  ) {
    return await this.productService.update(id, productDto);
  }

  @ApiTags('Manager')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  async remove(@Param() { id }: ProductoIdParamDto) {
    return await this.productService.remove(id);
  }

  @ApiTags('Manager')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put('disable/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully disabled.',
  })
  async disableProduct(@Param() { id }: ProductoIdParamDto) {
    return await this.productService.disableProduct(id);
  }

  @ApiTags('Manager')
  @Post('uploads/:productId')
  //@ApiBearerAuth()
  //@Roles(Role.Admin)
  @Public()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './products-images',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Images of product',
    type: FilesUploadDto,
  })
  @ApiQuery({ name: 'productId' })
  async uploadsImages(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Query('productId') { productId },
  ) {
    return await this.productService.uploadsImages(productId, images);
  }
}
