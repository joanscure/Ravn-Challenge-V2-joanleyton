import {
  ConflictException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtGlobalModule } from '../../jwt/jwt.module';
import * as request from 'supertest';
import { UsersService } from './users.service';
import { UsersController } from '../users.controller';
import { ProductsService } from '../../products/services/products.service';
import { ProductsFactory } from '../../products/factories/products.factory';

describe('User module', () => {
  let usersService: UsersService;
  let productService: ProductsService;
  let productFactory: ProductsFactory;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtGlobalModule],
      providers: [UsersService, ProductsService],
      controllers: [UsersController],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    productService = module.get<ProductsService>(ProductsService);
    app = module.createNestApplication();
    productFactory = new ProductsFactory();
    await app.init();
  });

  describe('Show client orders', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer())
        .get('/user/find-all-orders')
        .expect(401);
    });

    it('should return all the client orders', async () => {
      const array = await usersService.findAllOrders();
      expect(array.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Add products to cart', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer()).post('/user/add-to-cart').expect(401);
    });

    it('should throw exception', async () => {
      const category = await productService.createCategory();
      const newProduct = await productFactory.make(category.id);
      const product = await productService.create(newProduct);

      jest.spyOn(usersService, 'registerToCart').mockImplementation(() => null);
      try {
        await usersService.addToCart(0, {
          productId: String(product.id),
          quantity: 2,
          price: 10.2,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe('There are no items in the cart');
      }
    });

    it('should return the cart created', async () => {
      const user = await usersService.getAnyUser();
      const category = await productService.createCategory();
      const newProduct = await productFactory.make(category.id);
      const product = await productService.create(newProduct);

      const registerToCart = await usersService.addToCart(user.id, {
        productId: String(product.id),
        quantity: 2,
        price: 10.2,
      });

      expect(registerToCart).toHaveProperty('message');
    });
  });

  describe('Buy products', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer()).get('/user/buy-products').expect(401);
    });
     it('should throw  an exception when there are no products', async () => {
      try {
        await usersService.buyProducts(0);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe('There are no items in the cart');
      }
    });
    it('should return the order', async () => {
      const user = await usersService.getAnyUser();
      expect(await usersService.buyProducts(user.id)).toHaveProperty('message');
    });
  });

  describe('Like products', () => {
    it('should throw an exception if you already reacted', async () => {
      jest
        .spyOn(usersService, 'existsReaction')
        .mockImplementation(
          () => new Promise<boolean>((resolve) => resolve(true)),
        );
      try {
        await usersService.likeProduct(0, 0);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe(
          'The user has already reacted to this product',
        );
      }
    });

    it('should return the record created', async () => {
      jest
        .spyOn(usersService, 'existsReaction')
        .mockImplementation(
          () => new Promise<boolean>((resolve) => resolve(false)),
        );
      const user = await usersService.getAnyUser();
      const category = await productService.createCategory();
      const newProduct = await productFactory.make(category.id);
      const product = await productService.create(newProduct);

      await usersService.likeProduct(user.id, product.id);
    });
  });

  describe('Find my order', () => {
    it('should throw an exception if not found', async () => {
      try {
        await usersService.findOneOrder(0, 0);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Order not found');
      }
    });

    it('should return the order', async () => {
      jest
        .spyOn(usersService, 'existsReaction')
        .mockImplementation(
          () => new Promise<boolean>((resolve) => resolve(true)),
        );
      try {
        await usersService.findOneOrder(0, 0);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Order not found');
      }
    });
  });
});
