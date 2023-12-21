// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker, tr } from '@faker-js/faker';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

// delete all users
  await prisma.directMessage.deleteMany();
  await prisma.linkDirectMessage.deleteMany();
  await prisma.user.deleteMany();

//  // create 10 random Users
  let userArray = [];

  
  let img : String = "https://robohash.org/"; 
  for (let i = 0; i < 10; i++)
  {
    let fakeName :string = faker.person.firstName();
    userArray[i] =  await prisma.user.create({
      data:
      {
        userId: i,
        name: fakeName,
        email: faker.internet.email(),
        avatar: img + fakeName,
      },
      select:{
        avatar: true,
        name: true,
        userId: true,
      },
    })
  }


   console.log(userArray);

  let linkDmId = [];
  for (let i = 0; i < 4; i++){
    linkDmId[i] = await  prisma.linkDirectMessage.create({
      data:{
        UserId1: userArray[0].userId,
        UserId2: userArray[i +1].userId,
      },
      select: {
        conversationId : true,
        UserId1: true,
      }
    });
  }

  for (let i = 4; i < 7; i++){
    linkDmId[i] =  await  prisma.linkDirectMessage.create({
      data:{
        UserId1: userArray[1].userId,
        UserId2: userArray[i].userId,
      },
      select: {
        conversationId: true,
        UserId1: true,
      }
    });
  }

  console.log ("---------------");
  console.log(linkDmId);
  console.log ("---------------");
  

  
  for (let i = 0; i < 20; i++){
   let rand = Math.floor(Math.random() * 6);
    await prisma.directMessage.create({
      data:{
        text: faker.lorem.text(),
        privateId: linkDmId[rand].conversationId,
        senderId: linkDmId[rand].UserId1,
      }
    });
  }
  // create direct conversation between two users;
  
 


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



 


  console.log("all things created ");
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
