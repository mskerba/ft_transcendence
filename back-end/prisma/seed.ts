// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker, tr } from '@faker-js/faker';
import { connect } from 'http2';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

// delete all users
  await prisma.directMessage.deleteMany();
  await prisma.linkDirectMessage.deleteMany();
  await prisma.roomMessage.deleteMany();
  await prisma.roleUser.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

//  // create 10 random Users
  let userArray = [];

  
  let img : String = "https://robohash.org/"; 
  for (let i = 0; i < 20; i++)
  {
    let fakeName :string = faker.person.firstName();
    userArray[i] =  await prisma.user.create({
      data:
      {
        name: fakeName,
        email: faker.internet.email(),
        avatar: img + fakeName + ".png",
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

  console.log("availabe rooms");
  let Rooms = [];
  for (let i = 0; i < 5; i++){
    let fk_title = faker.person.jobTitle();

    Rooms[i]  = await prisma.room.create({
      data:{
        TypeRoom: "public",
        title : fk_title,
        avatar: img + fk_title + ".png",
      },
      select:{
        RoomId: true,
      }
    })  
  }

  console.log(Rooms);
  
  let RoleUser = [];
  for (let i = 0; i < 5; i++){
    let fk_title = faker.person.jobTitle();

    RoleUser[i]  = await prisma.roleUser.create({
      data:{
        RoleName : "member",
        roleUser:{connect:{userId: userArray[0].userId}},
        roomId: {connect: {RoomId: Rooms[i].RoomId}}
      }
    })  
  }

 

  // create messages in the first two groups
  let UserInd = 0, RoomInd = 0;
  let ind: number;
  for (ind = 0; ind < 20; ind++)
  {
    const data = await prisma.roomMessage.create({
      data:{
          text: faker.lorem.text(),
          roomId: {connect: {RoomId: Rooms[RoomInd].RoomId}},
          userId: {connect: {userId: userArray[UserInd].userId}},
      },
    });

    if (ind % 2 == 0 && ind)
      UserInd++;
    if (ind % 4 == 0 && ind)
      RoomInd++;
    console.log(data);
  }

 


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
