"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.directMessage.deleteMany();
    await prisma.linkDirectMessage.deleteMany();
    await prisma.user.deleteMany();
    let userArray = [];
    let img = "https://robohash.org/";
    for (let i = 0; i < 10; i++) {
        let fakeName = faker_1.faker.person.firstName();
        userArray[i] = await prisma.user.create({
            data: {
                userId: i,
                name: fakeName,
                email: faker_1.faker.internet.email(),
                avatar: img + fakeName,
            },
            select: {
                avatar: true,
                name: true,
                userId: true,
            },
        });
    }
    console.log(userArray);
    let linkDmId = [];
    for (let i = 0; i < 4; i++) {
        linkDmId[i] = await prisma.linkDirectMessage.create({
            data: {
                UserId1: userArray[0].userId,
                UserId2: userArray[i + 1].userId,
            },
            select: {
                conversationId: true,
                UserId1: true,
            }
        });
    }
    for (let i = 4; i < 7; i++) {
        linkDmId[i] = await prisma.linkDirectMessage.create({
            data: {
                UserId1: userArray[1].userId,
                UserId2: userArray[i].userId,
            },
            select: {
                conversationId: true,
                UserId1: true,
            }
        });
    }
    console.log("---------------");
    console.log(linkDmId);
    console.log("---------------");
    for (let i = 0; i < 20; i++) {
        let rand = Math.floor(Math.random() * 6);
        await prisma.directMessage.create({
            data: {
                text: faker_1.faker.lorem.text(),
                privateId: linkDmId[rand].conversationId,
                senderId: linkDmId[rand].UserId1,
            }
        });
    }
    console.log("all things created ");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map