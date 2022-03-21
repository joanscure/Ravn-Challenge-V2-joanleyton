import faker from '@faker-js/faker';
import { PrismaClient, SizeProduct } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const categories = ['shorts', 'skirts', 'pants'];

  const categoriesId = [];
  //categories
  for (let i = 0; i < 3; i++) {
    const category = await prisma.category.create({
      data: {
        name: categories[i],
      },
    });
    categoriesId.push(category.id);
  }
  // products
  const productsId = [];
  for (let i = 0; i < 5; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.unique(faker.commerce.product),
        size: faker.random.arrayElement([
          SizeProduct.L,
          SizeProduct.M,
          SizeProduct.S,
          SizeProduct.XL,
        ]),
        price: faker.datatype.float({ max: 1000 }),
        availableStock: faker.datatype.number({ min: 0 }),
        description: faker.random.words(),
        categoryId: faker.random.arrayElement(categoriesId),
      },
    });
    productsId.push(product.id);
  }
  //users

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
  const usersId = [];

  for (let i = 0; i < 12; i++) {
    const user = await prisma.user.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.unique(faker.internet.userName),
        password: await bcrypt.hash('any123', 10),
        role: 'USER',
        email: faker.unique(faker.internet.email),
      },
    });
    usersId.push(user.id);
  }

  //orders

  for (let i = 0; i < 12; i++) {
    const countOrdersOrders = faker.datatype.number({ min: 1, max: 4 });
    const order = await prisma.order.create({
      data: {
        userId: usersId[i],
        date: faker.date.recent(),
        totalAmount: faker.datatype.float({ min: 10, max: 900 }),
      },
    });
    for (let i = 0; i < countOrdersOrders; i++) {
      const price = faker.datatype.float({ min: 2, max: 300 });
      const quantity = faker.datatype.number({ min: 1, max: 9 });
      await prisma.orderDetail.create({
        data: {
          productId: faker.random.arrayElement(productsId),
          price: price,
          quantity: quantity,
          subtotal: price * quantity,
          orderId: order.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
