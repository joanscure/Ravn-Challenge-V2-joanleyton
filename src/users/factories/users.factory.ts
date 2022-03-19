import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserFactoryDto } from '../dto/user-factory.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersFactory {
  async make(params?: UserFactoryDto) {
    return {
      id: faker.datatype.number(),
      token: '',
      firstName: params?.firstName ?? faker.name.firstName(),
      lastName: params?.lastName ?? faker.name.lastName(),
      username: params?.username ?? faker.internet.userName(),
      password: await bcrypt.hash(
        params?.password ?? faker.internet.password(12),
        10,
      ),
      email: params?.email ?? faker.internet.email(),
      role: params?.role ?? Role.USER,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  }
}
