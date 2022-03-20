import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../utils/decorator/public.decorator';
import { Role } from '../utils/enums/role.enum';
import { ProductDto } from './dto/product.dto';
import { Roles } from '../utils/decorator/roles.decorator';
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
  @Get('find/:id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOne(id);
  }

  @ApiTags('User')
  @Get('all')
  @Public()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  async getAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('itemsPerPage', new DefaultValuePipe(10), ParseIntPipe)
    itemsPerPage?: number,
  ) {
    return await this.productService.findAll({ page, itemsPerPage });
  }

  @ApiTags('User')
  @Get('c/:categoryId')
  @Public()
  @ApiQuery({ name: 'productName', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('productName', new DefaultValuePipe('')) productName?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('itemsPerPage', new DefaultValuePipe(10), ParseIntPipe)
    itemsPerPage?: number,
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
  async uploadsImages(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Query('productId', ParseIntPipe) productId: number,
  ) {
    return await this.productService.uploadsImages(productId, images);
  }
}
