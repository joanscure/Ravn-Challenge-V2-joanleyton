import {
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtGlobalModule } from '../../jwt/jwt.module';
import * as request from 'supertest';
import { ProductsService } from '../services/products.service';
import { ProductsController } from '../products.controller';
import { ProductsFactory } from '../factories/products.factory';
import ProductAlreadyExistsException from '../exceptions/product-already-exists.exception';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import faker from '@faker-js/faker';

describe('Product module', () => {
  let productService: ProductsService;
  let app: INestApplication;
  let productFactory: ProductsFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtGlobalModule],
      providers: [ProductsService],
      controllers: [ProductsController],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);

    app = module.createNestApplication();
    await app.init();
    productFactory = new ProductsFactory();
  });

  describe('Find one product', () => {
    it('should throw an exception if it is not found', async () => {
      const productId = 0;
      try {
        await productService.findOne(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Product not found');
      }
    });

    it('should return the product found', async () => {
      const productId = 1;
      try {
        await productService.findOne(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Product not found');
      }
    });
  });

  describe('Find products by category', () => {
    it('should return all the products in the category', async () => {
      const category = await productService.createCategory();
      const products = await productService.getByCategory(category.id, '', {
        page: 0,
        itemsPerPage: 10,
      });

      expect(products.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Show all products', () => {
    it('should return all the products paginate per 10 elements', async () => {
      const PaginationDto = {
        page: 0,
        itemsPerPage: 10,
      };
      const arrayProducts = await productService.findAll(PaginationDto);
      expect(arrayProducts.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Create product', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer()).post('/products').expect(401);
    });

    it('should throw error if required fields are not submitted', async () => {
      const newProduct = await productFactory.make();
      newProduct.name = '';
      try {
        await productService.create(newProduct);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
    it('should throw error if the product is already registered', async () => {
      const newProduct = await productFactory.make();
      const result = new Promise<boolean>((resolve) => resolve(true));
      try {
        jest
          .spyOn(productService, 'existsOneByName')
          .mockImplementation(() => result);
        await productService.create(newProduct);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductAlreadyExistsException);
        expect(err.message).toBe('Product already exists with same name');
      }
    });
    it('you should return the registered product', async () => {
      const category = await productService.createCategory();
      const newProduct = await productFactory.make(category.id);
      const result = new Promise<boolean>((resolve) => resolve(false));
      jest
        .spyOn(productService, 'existsOneByName')
        .mockImplementation(() => result);
      expect(await productService.create(newProduct)).toBeTruthy();
    });
  });

  describe('Update product', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer()).patch('/products/1').expect(401);
    });

    it('should throw error if product does not exist', async () => {
      const newProduct = await productFactory.make();
      const result = new Promise<boolean>((resolve) => resolve(false));
      try {
        jest
          .spyOn(productService, 'existProduct')
          .mockImplementation(() => result);
        await productService.update(0, newProduct);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundException);
      }
    });
    it('Should return the updated product', async () => {
      const category = await productService.createCategory();
      const newProduct = await productFactory.make(category.id);
      const now = new Date();

      const product = await productService.create(newProduct);
      newProduct.name = faker.commerce.product.name + now.getTime();

      const productUpdated = await productService.update(
        product.id,
        newProduct,
      );

      expect(productUpdated.name).toBe(newProduct.name);
    });
  });

  describe('Delete product', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer()).delete('/products/1').expect(401);
    });

    it('should throw error if product does not exist', async () => {
      const result = new Promise<boolean>((resolve) => resolve(false));
      try {
        jest
          .spyOn(productService, 'existProduct')
          .mockImplementation(() => result);
        await productService.remove(0);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductNotFoundException);
      }
    });
    it('you should return the deleted product', async () => {
      const products = await productService.findAll({
        itemsPerPage: 1,
        page: 0,
      });

      const productUpdated = await productService.remove(products[0].id);

      expect(productUpdated).toBeTruthy();
    });
  });

  describe('Disable product', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer())
        .put('/products/1/disabled')
        .expect(401);
    });

    it('should throw error if product does not exist', async () => {
      const category = await productService.createCategory();
      const result = new Promise<boolean>((resolve) => resolve(false));
      const newProduct = await productFactory.make(category.id);
      await productService.create(newProduct);
      try {
        jest
          .spyOn(productService, 'existProduct')
          .mockImplementation(() => result);
        await productService.disableProduct(0);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
    it('should return the disabled product', async () => {
      const category = await productService.createCategory();
      const newProduct = await productFactory.make(category.id);
      const product = await productService.create(newProduct);

      const productUpdated = await productService.disableProduct(product.id);

      expect(productUpdated).toBeTruthy();
    });
  });
});
