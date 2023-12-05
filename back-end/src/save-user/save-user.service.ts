import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import { faker } from '@faker-js/faker';

@Injectable()
export class SaveUserService {
    constructor(private readonly prismaService: PrismaService){}


   
    async saveUser(username: string) : Promise<any>{
        let user = await this.prismaService.user.create({
            data:{
                name: username,
                email: faker.internet.email()
            },
        });
        return user;
    }


    async findUser(username: string): Promise<number>{
          return await this.prismaService.user.count({
            where : {name : username},
          });
    }

    
      async addSock(username: string, socketId: string) :Promise<void>{


        if (this.findUser(username))
        {
            await this.prismaService.user.update({
                where: {name: username},
                data: {
                    sockId : socketId
                },
            });
        }
        else
        {
            console.log("database not initialized yet");
        }

    
    }

}
