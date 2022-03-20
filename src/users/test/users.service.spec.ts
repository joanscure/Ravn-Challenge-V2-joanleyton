import {
  ConflictException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtGlobalModule } from '../../jwt/jwt.module';
import { faker } from '@faker-js/faker';
import { UsersFactory } from '../../users/factories/users.factory';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { Role } from '../../utils/enums/role.enum';
import { UsersServices } from '../users.services';
import { UsersController } from '../users.controller';

describe('User module', () => {
  let usersService: UsersServices;
  let userController: UsersController;
  let userFactory: UsersFactory;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtGlobalModule],
      providers: [UsersServices],
      controllers: [UsersController],
    }).compile();

    usersService = module.get<UsersServices>(UsersServices);
    userController = module.get<UsersController>(UsersController);
    userFactory = new UsersFactory();

    app = module.createNestApplication();
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
      expect(array.length).toBeLessThanOrEqual(0);
    });
  });

  describe('Add products to cart', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer()).post('/user/add-to-cart').expect(401);
    });

    it('should return the product add to cart', async () => {
      jest.spyOn(usersService, 'registerToCart').mockImplementation(() => null);
      const registerToCart = await usersService.addToCart(0, {
        productId: 0,
        quantity: 0,
        price: 0,
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
        await usersService.buyProducts({
          sub: 0,
          username: '',
          role: Role.Admin,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe('There are NO items in the cart');
      }
    });
  });

  describe('Like products', () => {
    it('should throw authentication error if token not send', async () => {
      await request(app.getHttpServer())
        .get('/user/like-product/1')
        .expect(401);
    });

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
  });
});
