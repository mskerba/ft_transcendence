import { Injectable, Param } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import { faker, tr } from '@faker-js/faker';
import { TimeoutError } from 'rxjs';
import { send } from 'process';
import { JsPromise, JsonArray } from '@prisma/client/runtime/library';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) {}

   async findUserById(userid: number): Promise<any> {
        return  await this.prismaService.user.findFirst({
           where: {userId: userid},
           select: {
            name : true,
            sockId: true,
           },
       });
   }

   async findUserByname(username : string): Promise<object>{
    return  await this.prismaService.user.findFirst({
        where: {name: username},
        select: {
         userId : true,
        },
    });
   }

   async findUserBySockid(socketId: string){
    return  await this.prismaService.user.findFirst({
        where: {sockId: socketId},
        select: {
         userId : true,
        },
    });
   }

    async SockToClient(socketId: string, username: string): Promise<void>{
        
        const data = await this.findUserByname(username);
        console.log(data);
        if (data)
        {
            await this.prismaService.user.update({
                where : {name: username},
                data:{
                    sockId: socketId,
                },
            })
        }
        else
            console.log("this client not found");
    }

    async  findLinkMessage(user1: number, user2: number): Promise<any>{
        const data = await this.prismaService.linkDirectMessage.findFirst({
            where :{
                UserId1 : user1,
                UserId2: user2,
            },
            select: {
                conversationId: true,
            },
        });
        return (data);
    }
    async   LinkDirectMessage(sender: number, receiver: number): Promise<any>{
        const data = await this.prismaService.linkDirectMessage.create({
            data: {
                UserId1: sender,
                UserId2: receiver,
            },
            select: {
                conversationId: true,
            }
        })
        return (data);
    }


    async addDirectMessage(sender: number, receiver: number, msg: string): Promise<object>{
        
        console.log("the param is : ", sender, " : ", receiver, " : ", msg);
        
        let str = await this.findLinkMessage(sender, receiver);
        
        if (!str)
            str = await this.LinkDirectMessage(sender, receiver);
        
        console.log("this is str: ", str);
        const data =  await this.prismaService.directMessage.create({
            data: {
                text: msg,
                userid: { connect: {userId: sender}},
                PrvMsgId: { connect: {conversationId : str.conversationId}},

            },
            select:{
                text: true,
                privateId: true,
                senderId: true,
            }          
        });

        return data;
    }


    // add status of online or offline or ingame

    async FriendStatus(userId: number){

        const data =  await this.prismaService.friendship.findMany({
            
            where: 
            {
                OR: [
                        {user1Id: userId,},
                        {user2Id: userId,},
                    ],
                AND:[
                        {user1 :{ sockId : {not: null} }},
                        {user2: { sockId : {not: null} }}
                    ]
            },
            select:{
                user1: { select: {sockId: true}},
                user2: { select: {sockId: true}},

            }

            });
        
            return data;
    }







    }