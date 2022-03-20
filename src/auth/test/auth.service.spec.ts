import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtGlobalModule } from '../../jwt/jwt.module';
import { faker } from '@faker-js/faker';
import { UsersFactory } from '../../users/factories/users.factory';
import * as bcrypt from 'bcrypt';
import WrongPasswordException from '../exceptions/user-not-found.exception';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { Role } from '../../utils/enums/role.enum';
import UserAlreadyExistsException from '../exceptions/user-already-exists.exception';
import { UserDto } from '../dto/user.dto';

describe('Auth module', () => {
  let authService: AuthService;
  let authController: AuthController;
  let userFactory: UsersFactory;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtGlobalModule],
      providers: [AuthService],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    userFactory = new UsersFactory();

    app = module.createNestApplication();
    await app.init();
  });

  describe('login', () => {
    let params: LoginDto;
    beforeEach(async () => {
      params = {
        username: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(6), 10),
      };
    });

    it('should return an exception if user is not found', async () => {
      const result = null;

      try {
        jest.spyOn(authService, 'findUser').mockImplementation(() => result);
        await authController.login(params);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
    });

    it('should return an exception if the password is wrong', async () => {
      const resultFind: Promise<User> = userFactory.make({
        username: params.username,
      });

      try {
        jest
          .spyOn(authService, 'findUser')
          .mockImplementation(() => resultFind);

        await authController.login(params);
      } catch (e) {
        expect(e).toBeInstanceOf(WrongPasswordException);
        expect(e.message).toBe('Wrong username/password provided');
      }
    });

    it('should return the token when the user has successfully logged in.', async () => {
      const resultFind: Promise<User> = userFactory.make({
        username: params.username,
        password: params.password,
      });

      jest.spyOn(authService, 'findUser').mockImplementation(() => resultFind);
      jest.spyOn(authService, 'updateToken').mockImplementation(() => null);

      expect(await authController.login(params)).toHaveProperty('access_token');
    });
  });

  describe('Register User Manager', () => {
    it('should return authorization error', async () => {
      await request(app.getHttpServer())
        .post('/auth/register-admin')
        .expect(401);
    });

    it('should throw error if email already exists', async () => {
      const userAdmiInvalid = await userFactory.make();
      const resultCheckByEmail = new Promise<boolean>((resolve) =>
        resolve(true),
      );

      try {
        jest
          .spyOn(authService, 'checkUserExistsByEmail')
          .mockImplementation(() => resultCheckByEmail);

        await authService.registerUser(userAdmiInvalid, Role.Admin);
      } catch (e) {
        expect(e).toBeInstanceOf(UserAlreadyExistsException);
        expect(e.message).toBe('User already exists with same email');
      }
    });

    it('should throw error if username already exists', async () => {
      const userAdmiInvalid = await userFactory.make();
      const resultCheckByUsername = new Promise<boolean>((resolve) =>
        resolve(true),
      );

      try {
        jest
          .spyOn(authService, 'checkUserExistsByUsername')
          .mockImplementation(() => resultCheckByUsername);

        await authService.registerUser(userAdmiInvalid, Role.Admin);
      } catch (e) {
        expect(e).toBeInstanceOf(UserAlreadyExistsException);
        expect(e.message).toBe('User already exists with same username');
      }
    });

    it('should return the user if the data is correct', async () => {
      const userAdmiInvalid = await userFactory.make();
      expect(
        await authService.registerUser(userAdmiInvalid, Role.Admin),
      ).toBeInstanceOf(UserDto);
    });
  });

  describe('Register User Client', () => {
    it('should throw error if email already exists', async () => {
      const userAdmiInvalid = await userFactory.make();
      const resultCheckByEmail = new Promise<boolean>((resolve) =>
        resolve(true),
      );

      try {
        jest
          .spyOn(authService, 'checkUserExistsByEmail')
          .mockImplementation(() => resultCheckByEmail);

        await authService.registerUser(userAdmiInvalid);
      } catch (e) {
        expect(e).toBeInstanceOf(UserAlreadyExistsException);
        expect(e.message).toBe('User already exists with same email');
      }
    });

    it('should throw error if username already exists', async () => {
      const userAdmiInvalid = await userFactory.make();
      const resultCheckByUsername = new Promise<boolean>((resolve) =>
        resolve(true),
      );

      try {
        jest
          .spyOn(authService, 'checkUserExistsByUsername')
          .mockImplementation(() => resultCheckByUsername);

        await authService.registerUser(userAdmiInvalid);
      } catch (e) {
        expect(e).toBeInstanceOf(UserAlreadyExistsException);
        expect(e.message).toBe('User already exists with same username');
      }
    });

    it('should return the user if the data is correct', async () => {
      const userAdmiInvalid = await userFactory.make();
      expect(await authService.registerUser(userAdmiInvalid)).toBeInstanceOf(
        UserDto,
      );
    });
  });
});
