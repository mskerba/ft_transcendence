// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
 
  // delete all users
//   await prisma.directMessage.deleteMany();
//   await prisma.linkDirectMessage.deleteMany();
//   await prisma.user.deleteMany();

//  // create 30 random Users
//  let userArray = [];

//   for (let i = 0; i < 20; i++)
//   {
//     userArray[i] =  await prisma.user.create({
//       data:
//       {
//         name: faker.person.firstName(),
//         email: faker.internet.email(),
//       }
//     })
//   }


//   console.log(await userArray);

  // for (let i = 0; i < 10; i++)
  // {
  //   let id1 = userArray[Math.floor(Math.random() * 20)].userId;
  //   let id2 = userArray[Math.floor(Math.random() * 20)].userId;
  //   if (id1 == id2)
  //     continue ;
  //     await prisma.linkDirectMessage.create({
  //       data:
  //       {
  //         UserId1: id1,
  //         UserId2: id2,
  //       }
  //     })
  // }/ create direct conversation between two users;
  
 


// prisma.friendship.deleteMany()

// let userArr = await prisma.user.findMany({});


// let j = 0;
// let k = 19;

// for (let i = 0; i < 10; i++)
// {
//      let id1: number = userArr[j++].userId;
//      let id2: number = userArr[k--].userId;

//     await prisma.friendship.create({
//       data: {
          
//           user1: { connect:{userId : id1}},
//           user2: { connect: {userId: id2}},
      
//           },

//       });
// }


// prisma.directMessage.deleteMany();
// const arr = [8 ,7 , 14];

// for (let i = 0; i < 5; i++)
//   await prisma.directMessage.create({
//     data:{
//       text: faker.lorem.text(),
//       privateId: "clq2uzvon0007kb54vti74r2j",
//       senderId: 8,
//     }

//   });
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

