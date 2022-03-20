import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const category = ['shorts','skirts','pants'];
  for (let i = 0; i < 3; i++) {
    await prisma.category.create({
      data: {
        name: category[i],
      },
    });
  }

  await prisma.user.create({
    data: {
      firstName: 'Joan',
      lastName: 'Leyton',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
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
