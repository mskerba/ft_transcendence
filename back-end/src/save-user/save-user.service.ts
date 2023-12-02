import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import { faker } from '@faker-js/faker';

@Injectable()
export class SaveUserService {
    constructor(private readonly prismaService: PrismaService){}

    async saveUser(username: string) : Promise<any>{
        const user = await this.prismaService.user.create({
            data:{
                name: username,
                email: faker.internet.email()
            },
        });
        return user;
    }

    async addSock(username: string, socketId: string) :Promise<void>{

        await this.prismaService.user.update({
            where: {name: username},
            data: {
                sockId : socketId
            },
        });
    }

}
