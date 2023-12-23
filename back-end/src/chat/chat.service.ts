import { ConsoleLogger, HttpStatus, Injectable, Param, HttpException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import {CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto} from './DTO/create-groups.dto'
import { da, faker, tr } from '@faker-js/faker';

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


    async addDirectMessage(sender: number, receiver: number, msg: string, Unseen: number): Promise<object>{
        
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
                countUnseen: Unseen
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


    async findGroupByUser(userId : number){
        
        const GroupId = await this.prismaService.roleUser.findMany({
            where:{
                UserId: userId
            },
            select:{
                RoomId: true,
            },
        });
        return GroupId;
    }

    async lastMessageGroup(groupId: string){
        const data = await this.prismaService.roomMessage.findFirst({
            where: {
                    RoomId: groupId,
            },
            orderBy:[{dateSent : "desc"},],
            distinct:['RoomMessageId'],
            select:{
                dateSent: true,
                text: true,
            }
        });
        return data;
    }

    async MyFriends(user1: number){

    //    let mp = new Map<number, object>();
        
        const DirectMessages = await this.prismaService.linkDirectMessage.findMany({
            where:{
                OR: [
                        {UserId1:  user1},
                        {UserId2:  user1},
                    ],
            },
            select:{
                user1: { select: {userId: true, name : true, avatar: true}},
                user2: { select: {userId: true, name: true, avatar: true}},
                conversationId: true,
                          
            },
    
        });
        
        let user = DirectMessages.map((id) => {
            if (id.user1.userId != user1)
                return id.user1;
            return id.user2;
        });

        let ids = DirectMessages.map((client) => client.conversationId);
        console.log("this is private ids of Direct Messages : ", ids);

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
                dateMessage: true,
            }
        });


        const GroupIds = (await this.findGroupByUser(user1)).map(id => id.RoomId);
        console.log("groups ids is : ", GroupIds);
        const GroupMessages = await this.prismaService.room.findMany({
            where: {
                RoomId: {
                    in: GroupIds,
                },
            },
            select:{
                RoomId: true,
                avatar: true,
                title: true,
            }
            
        });
    

        console.log("this is messages with the given conversation ids: ", messages);


        let i = 0;   
        let arrData  = [] ; 
        messages.forEach(item => { 
            let obj: object = {"Unseen": item.countUnseen, "Name": user[i].name , "lastMsg": item.text , "Date": item.dateMessage, 
                "Avatar": user[i].avatar , "convId": item.privateId, "group": false };
            arrData.push(obj);
            i++;
        })
        

        
        for (const item of GroupMessages) {
            let msg : string = "welcome to " + item.title;
            let date = new Date();
            const lastMsg : any = await this.lastMessageGroup(item.RoomId);
            console.log(lastMsg);
            if (lastMsg)
            {
                console.log("lastMsg found");
                date = lastMsg.dateSent;
                msg = lastMsg.text;
            }
            let obj2 : object = {"Unseen": 4, "Name": item.title, 
            "lastMsg": msg, "Date": date, "Avatar": item.avatar, "convId": item.RoomId, "group": true };
            arrData.push(obj2);
         }
    
        return arrData;

    }

    // retrive messages between two users
    async   chatHistory(id1: number, convId: string){
        
        const data = await this.prismaService.directMessage.findMany({
            where :{
                privateId: convId,
            },
            select:{
                text: true,
                senderId: true,
                userid:{
                    select:{
                        name: true,
                    }
                }
            },
        });
        
        let arrData = [];
        data.forEach(item => {
            const obj: object = {"Id": item.senderId, "Message": item.text};
            arrData.push(obj);
        });
        return arrData;
    }    

    // create group here
    async createGroup(createGroupDto: CreateGroupDto){
        
        let room;
        try{
            room =  await this.prismaService.room.create({
                data: {
                    TypeRoom: createGroupDto.TypeRoom,
                    avatar: createGroupDto.avatar,
                    title: createGroupDto.title,
                    password: createGroupDto.password
                },
                select:{
                    RoomId: true,
                    TypeRoom: true,
                    password: true,
                }
            });
        }
        catch(error)
        {
            return {"error": "the data is failed to create group", "status": HttpStatus.OK};
        }

        if (room && room.TypeRoom == "protected" && room.password == null)
        {
             await this.prismaService.room.delete({
                where:{
                    RoomId : room.RoomId
                }
            })
            return ({"error": "set the password for protected group"});
        }

        try {

            let UserGroup = await this.prismaService.roleUser.create({
                data:{
                    
                    roleUser: {connect: {userId: createGroupDto.UserId}},
                    RoleName: "owner",
                    roomId: { connect: {RoomId: room.RoomId}}
                },
                select:{
                    UserId: true,
                    RoleName: true,
                    RoomId: true,
                }
            })
            return {"success": "the group is created", "status": HttpStatus.OK};
        }
        catch(error){
            return {"error": "this user can't create group", "status": HttpStatus.BAD_REQUEST}
        }
    }

    // ADD User TO the group
    async addTogroup(createROle :CreateRoleUserDto){
        
        try{

            const checkGroup = await this.prismaService.room.findUnique({
            where:{
                RoomId: createROle.roomId
            },
        })
        if (!checkGroup)
            return {"error": "Room Not Found: Please verify the room name and try again", status: HttpStatus.NOT_FOUND};
        } catch(error){
            return {"error" : "Error: Incorrect data type. Please provide the correct type of data", status :HttpStatus.BAD_REQUEST};
        }

        try {

            const isBanned = await this.prismaService.banUser.findFirst({
                where:{
                    RoomId: createROle.roomId,
                    UserId: createROle.userId,

                }
            })
            if (isBanned)
                return {"error" : "User is banned and cannot be added to the group again",
                status: HttpStatus.FORBIDDEN};
            
            const data = await this.prismaService.roleUser.create({
                data:{
                    roleUser: {connect: {userId: createROle.userId}},
                    RoleName: createROle.roleName,
                    roomId: {connect: {RoomId: createROle.roomId}}
                }
            });
            return {"success" : true, status: HttpStatus.OK};
        }catch(error){
            return {"error" : "Error: Incorrect data type. Please provide the correct type of data",
            status: HttpStatus.BAD_REQUEST};
        }

    }

    // search on group by id
    async findGroupById(roomId: string)
    {
        const data = await this.prismaService.room.findUnique({
            where: {
                RoomId: roomId,
            }
        });

        return data;
    }

    // checker user is muted or not
    async checkIsMuted(roomId: string, message: string, uId: number){
        const time = await this.prismaService.muteUser.findFirst({
            where:{
                RoomId: roomId,
                UserId: uId,
            },
            select:{
                StartTime: true,
                EndTime: true,
                MuteUserId: true,
            }
        })
        if (time){
            if (time.EndTime >= time.StartTime){
                this.prismaService.muteUser.delete({
                    where:{
                        MuteUserId: time.MuteUserId
                    }
                });
                return {
                    "error": "Attention: Please be mindful of group guidelines "+
                    "continued violations may result in removal or suspension "
                }
            }
            else{
                return {
                    "error": "User is in Muted mode",
                    status: HttpStatus.FORBIDDEN
                }
            }
        }
        return {
            "success": true,
            status: HttpStatus.OK    
        };
    }

    // add message to the group
    async addMessageToRoom(roomId: string, message: string, uId: number){
        
        const userInGroup = await this.findUserInGroup(uId, roomId);
        if (userInGroup.error != undefined)
            return userInGroup;
        const isMuted = await this.checkIsMuted(roomId, message, uId);
        if (isMuted.error != undefined)
            return isMuted 
        
        await this.prismaService.roomMessage.create({
            data: {
                text: message,
                roomId: {connect : { RoomId: roomId}},
                userId: {connect: {userId: uId}}
            }
        })
        return {success: true, status: HttpStatus.OK};
    }

    // histoy of group
    async historyOfGroup(group: string){
        
        try{
            const data =  await this.prismaService.roomMessage.findMany({
                where: {
                    RoomId: group
                },
                select:{
                    text: true,
                    UserId: true,
                    userId:{
                        select:{name: true, avatar: true},
                    }
                }
            });
            
            let arrData = [];
            for (const dt of data){
                let obj: object = {"Id": dt.UserId, "Message": dt.text, "Name": dt.userId.name, "Avatar": dt.userId.avatar};
                arrData.push(obj);
            }
            return (arrData);
        }catch(error){
            return {"error": "messages can't retrieved from this group", "status": HttpStatus.NOT_FOUND};
        }
    }
    // find user if has this group
    async findUserInGroup(userId : number, roomId: string)
    {
        try {

            const data =  await this.prismaService.roleUser.findFirst({
                 where:{
                     RoomId: roomId,
                     UserId: userId,
                 },
                 select:{
                     RoleId: true,
                 }
             })
             if (data)
                 return {"success": true, status: HttpStatus.OK};
             return {"error": "user not found in this group", "status": HttpStatus.BAD_REQUEST};
        }
        catch(error){
            return {"error": "your input is not correct", "status": HttpStatus.BAD_REQUEST};
        }
    }

    async findRoleUser(senderId: number, group: string){
        return await this.prismaService.roleUser.findFirst({
            where:{
                UserId: senderId,
                RoomId: group,
            },
            select:{
                RoleName: true,
            }
        });
    }


    async PunishCheker(punishDto: PunishDto) {
        const Role1 = await this.findRoleUser(punishDto.senderId, punishDto.roomId);
        const Role2 = await this.findRoleUser(punishDto.userId, punishDto.roomId)
        if (!Role1 || !Role2)
            return {"error": "users or group not found "};
        const senderId = Role1.RoleName;
        const userId = Role2.RoleName;
        
        if (senderId == "member")
            return {"error": "the sender who wanna delete is regular member",
            status: HttpStatus.NOT_FOUND
        };
        if (senderId == "admin" && userId == "owner")
            return {error: "admin doesn't have privilege to kick owner",
            status: HttpStatus.NOT_FOUND
        };

        return {"success": true, status: HttpStatus.CREATED};
    }
    // kick user in group
    async kickUser(punishDto: PunishDto){
    
        try {
            const data = await this.PunishCheker(punishDto);
            if (data.error !== undefined)
                return data;
    
            await this.prismaService.roleUser.deleteMany({
                where:{
                    AND:[
    
                       { UserId: punishDto.userId },
                       { RoomId: punishDto.roomId },
                    ]
                }
            })
            return data;
        }catch(error){
            return {"error": "this user can't be kicked "}
        }
    }

    // ban user in group
    async banUser(punishDto: PunishDto){

        const data = await this.PunishCheker(punishDto);
        if (data.error !== undefined)
            return data;

        try{

            await this.prismaService.banUser.create({
                data:{
                    roomId : {connect : {RoomId: punishDto.roomId}},
                    userId: {connect: {userId: punishDto.userId}},
                }
            })
            await this.prismaService.roleUser.deleteMany({
                where: {
                    AND:[
    
                        { UserId: punishDto.userId },
                        { RoomId: punishDto.roomId },
                     ]
                }
            })

            return data;
        }
        catch(error){  
            return {
                "error": "user already is banned or can't be banned", 
                "status": HttpStatus.NOT_ACCEPTABLE
            };
        }
    }

    // mute user in group specific type
    async muteUser(muteDto: MuteDto){


        const data = await this.PunishCheker(muteDto);
        if (data.error != undefined)
            return data;

        try{
            await this.prismaService.muteUser.create({
                data:{
                    roomId : {connect : {RoomId: muteDto.roomId}},
                    userId: {connect: {userId: muteDto.userId}},
                    StartTime: new Date(Date.now()),
                    EndTime: new Date(Date.now() + (muteDto.numberHour * 60 * 60 * 1000)),
                }
            })
            return data;
        }catch(error){
            return {
                "error": "user already muted or can't be muted",
                "status": HttpStatus.NOT_ACCEPTABLE
            }
        }
    }

    // about group
    async about(convId: string, id: number){
        const data = await this.prismaService.roleUser.findMany({
            where:{
                RoomId: convId,
            },
            select:{
                RoleName: true,
                UserId: true,
                roleUser:{
                    select:{
                        avatar: true,
                        name: true,
                    },
                }
            }
        });
        
        let arrData = [];
        let TypeId: string = "none";

        data.forEach(item =>{
            if (item.UserId == id)
                TypeId = item.RoleName;
            else
            {
                const obj: object = {"Id": item.UserId, "Role": item.RoleName, "Name": item.roleUser.name, "Avatar": item.roleUser.avatar};
                arrData.push(obj);
            }
        })
        arrData.push({"UserRole": TypeId});
        console.log(arrData);
        return (arrData);
    }

    async leaveGroup(convId: string, id: number){

        try{
          const data = await this.prismaService.roleUser.deleteMany({
                where:{
                    AND:[
    
                       { UserId: id },
                       { RoomId: convId},
                    ]
                }
            })
            return {"success" : "Successfully left the group.", status: HttpStatus.OK};
        }catch(error){
            return {"error": "Error: You are not a member of the group or the provided data is incorrect", status : HttpStatus.BAD_REQUEST}
        }
    }
}