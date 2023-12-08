"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.user.deleteMany();
    let userArray = [];
    for (let i = 0; i < 20; i++) {
        userArray[i] = await prisma.user.create({
            data: {
                name: faker_1.faker.person.firstName(),
                email: faker_1.faker.internet.email(),
            }
        });
    }
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