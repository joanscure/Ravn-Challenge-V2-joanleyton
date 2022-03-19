import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.services';
import { LoginDto } from '../dto/login.dto';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtGlobalModule } from '../../jwt/jwt.module';
import {User} from '@prisma/client';

describe('Auth module', () => {
  let prismaService: PrismaService;
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, JwtGlobalModule],
      providers: [AuthService],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    //let userEmail = Faker
    it('should return an exception if user is not found', async () => {
      const result = null;
      const params: LoginDto = {
        username: 'no_user',
        password: 'password',
      };

      try {
        jest.spyOn(authService, 'findUser').mockImplementation(() => result);
        await authController.login(params);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
    });

    it('should return an exception if the password is wrong', async () => {
      const params: LoginDto = {
        username: 'no_user',
        password: 'password',
      };

      try {
        await authController.login(params);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
    });
  });

  //it('/ (GET)', () => {
  //return request(app.getHttpServer())
  //.get('/')
  //.expect(200)
  //.expect('Hello World!');
  //});
});
