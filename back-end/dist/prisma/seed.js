"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    const arr = [8, 7, 14];
    for (let i = 0; i < 5; i++)
        await prisma.directMessage.create({
            data: {
                text: faker_1.faker.lorem.text(),
                privateId: "clq2uzvon0007kb54vti74r2j",
                senderId: 8,
            }
        });
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