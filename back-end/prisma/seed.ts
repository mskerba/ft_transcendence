// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const user1 = await prisma.user.upsert({
    where: { email: 'mohamedtahameaizi@gmail.com' },
    update: {},
    create: {
      email: 'mohamedtahameaizi@gmail.com',
      name: 'mohamed',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "tahameaizi@gmail.com" },
    update: {},
    create: {
      email: "tahameaizi@gmail.com",
      name: 'taha',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "momeaizi@student.1337.ma" },
    update: {},
    create: {
      email: "momeaizi@student.1337.ma",
      name: 'momeaizi',
    },
  });

  console.log({ user1, user2, user3 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
