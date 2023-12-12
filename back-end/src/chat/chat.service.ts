import { ConsoleLogger, Injectable, Param } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import {CreateGroupDto} from './DTO/create-groups.dto'
import { faker, tr } from '@faker-js/faker';
import { TimeoutError, distinct, map } from 'rxjs';
import { send } from 'process';
import { JsPromise, JsonArray } from '@prisma/client/runtime/library';
import { equal } from 'assert';
var Multimap = require('multimap');

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

    async MyFriends(user1: number){

        

       let mp = new Map<number, object>();
        
        const data = await this.prismaService.linkDirectMessage.findMany({
            where:{
                OR: [
                        {UserId1:  user1},
                        {UserId2:  user1},
                    ],
            },
            select:{
                user1: { select: {userId: true, name : true}},
                user2: { select: {userId: true, name: true}},
                conversationId: true,              
            },
    
        })
        
        let user = data.map((id) => {
            if (id.user1.userId != user1)
                return id.user1;
            return id.user2;
        });

        console.log ("this is user Id : ", user );
        let ids = data.map((client) => client.conversationId);
        console.log("this is ids: ", ids);

        const messages = await this.prismaService.directMessage.findMany({
            where: {
                privateId:{
                    in: ids           
                }
            },
            orderBy:[{
                dateMessage: 'desc',
                },
            ],
            distinct: ['privateId'],
            select:{
                privateId: true,
                countUnseen: true,
                text: true,
                
            }
        });

        console.log("this is messages with give conversation ids: ", messages);


        let i = 0;        
        messages.forEach(item => { 
            let obj: object = {"Unseen": item.countUnseen, "name": user[i].name , lastMsg: item.text }
            mp.set(user[i].userId, obj);
            i++;
        })

        
        return mp;
        
        

    }

    // create groups here

    // async createGroup(createGroupDto: CreateGroupDto){
        
    //     let room =  await this.prismaService.room.create({
    //         data: {
    //             TypeRoom: createGroupDto.TypeRoom,
    //             avatar: createGroupDto.avatar,
    //             title: createGroupDto.title,
    //             password: createGroupDto.password
    //         }
    //     });

    //     let roleUser = await this.prismaService.roleUser.create({
    //         data:{
    //             //roleUser: {connect:{userId: createGroupDto.UserId}},
    //             UserId: createGroupDto.UserId,
    //             RoleName: createGroupDto.RoleName,
    //             RoomId: room.RoomId
    //         },
    //         select:{}
    //     })
    //     return roleUser;
    // }

}