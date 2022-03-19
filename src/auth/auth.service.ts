import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.services';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import UserAlreadyExistsException from './exceptions/user-already-exists.exception';
import { Role } from '../utils/enums/role.enum';
import { PayloadJWTDto } from '../jwt/dto/payload-jwt.dto';
import WrongPasswordException from './exceptions/user-not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginDto) {
    const user = await this.findUser(request);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(request.password, user.password);

    if (!isMatch) {
      throw new WrongPasswordException();
    }

    const payload: PayloadJWTDto = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    await this.updateToken(user, token);

    return {
      access_token: token,
    };
  }

  async registerUser(data: UserDto, role: Role = Role.User) {
    try {
      const userExistsByEmail = await this.checkUserExistsByEmail(data.email);

      if (userExistsByEmail) {
        throw new UserAlreadyExistsException('email');
      }

      const userExistsByUsername = await this.checkUserExistsByUsername(
        data.username,
      );

      if (userExistsByUsername) {
        throw new UserAlreadyExistsException('username');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const payload = {
        ...data,
        password: hashedPassword,
        role: role,
      };

      const user = await this.prismaService.user.create({
        data: payload,
      });

      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async checkUserExistsByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) return true;
    return false;
  }

  async checkUserExistsByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) return true;
    return false;
  }

  async findUser(loginDto: LoginDto): Promise<User | undefined> {
    return this.prismaService.user.findFirst({
      where: {
        username: loginDto.username,
      },
    });
  }

  async updateToken(user: User, token: string) {
    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: token,
      },
    });
  }
}
