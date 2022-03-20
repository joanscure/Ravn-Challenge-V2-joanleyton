import faker from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/utils/enums/role.enum';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    await prisma.category.create({
      data: {
        name: faker.commerce.productMaterial(),
      },
    });
  }

  await prisma.user.create({
    data: {
      firstName: 'Joan',
      lastName: 'Leyton',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: Role.Admin,
      email: 'joan.leyton08@gmail.com',
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
