import { ConsoleLogger, HttpStatus, Injectable, Param, HttpException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'
import {CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto, UpdateGroupDto} from './DTO/create-groups.dto'
import { da, faker, tr } from '@faker-js/faker';
import { DirectMessage } from '@prisma/client';
import { JsonArray } from '@prisma/client/runtime/library';
import { Dirent } from 'fs';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) {}

   async findUserById(userid: number)//: Promise<any> 
   {
        return  await this.prismaService.user.findFirst({
           where: {userId: userid},
           select: {
            name : true,
            sockId: true,
           },
       });
   }

   async findUserByname(username : string)//: Promise<any>
   {
    return  await this.prismaService.user.findFirst({
        where: {name: username},
        select: {
         sockId: true,
         userId: true,
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

    async SockToClient(socketId: string, id: number){
        
        // const data = await this.findUserByname(username);
        console.log("SockToclient() socId : ", socketId, " userId : ", id);
        try{
            await this.prismaService.user.update({
                where : {userId: id},
                data:{
                    sockId: socketId,
                },
            })
        }
        catch(error){
            console.log("error happen");
            console.log(error);
        }
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
        
        //console.log("this is str: ", str);
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
        
        try {
            const GroupId = await this.prismaService.roleUser.findMany({
                where:{
                    UserId: userId
                },
                select:{
                    RoomId: true,
                    roomId:{
                        select:{
                            title: true,
                            avatar: true,
                        }
                    }
                },
            });
            return GroupId;
        }catch(error){
            console.log("error in findGroupByuser")
        }
    }

    async lastMessageGroup(groupId: string){
        const data = await this.prismaService.roomMessage.findFirst({
            where: {
                    RoomId: groupId,
            },
            orderBy:[{dateSent : "desc"},],
            distinct:['RoomId'],
            select:{
                dateSent: true,
                text: true,
            }
        });
        return data;
    }
 

    async allGroupLastMessages(user1: number){
        let arrData = [] ;
        try{

            const room =  await this.findGroupByUser(user1);
            for (const item in room){

                let data = (await this.lastMessageGroup(room[item].RoomId));
                let lastMsg : string = "welcome to "+ room[item].roomId.title;
                let date = new Date();
                if (data)
                {
                    lastMsg = data.text;
                    date = data.dateSent;
                }
               
                const obj: object =  {"Unseen": 4, "Name": room[item].roomId.title, 
                "lastMsg": lastMsg, "Date": date, "Avatar": room[item].roomId.avatar, "convId": room[item].RoomId, "group": true };  
                arrData.push(obj);
            }
            return arrData;

        }catch(error){
            console.log("error in allGroupLastMessages");
        }
    }

    async allDirectLastMessages(user1: number){
        let arrData = [];
        let mp = new Map();
        let convId = [];
        try{
            const data = await this.prismaService.linkDirectMessage.findMany({
                where:{
                    OR:[
                        {UserId1 : user1},
                        {UserId2: user1},
                        ]
                },
                distinct:['conversationId'],
                select:{
                    conversationId: true,
                    user1: {select : {userId: true, name: true, avatar : true}},
                    user2: {select : {userId: true, name: true, avatar : true}},
                }
            })
            let obj : object;
            
            data.forEach(id => {
                if (id.user1.userId != user1)
                    obj = {"id": id.user1.userId, "name": id.user1.name, "avatar": id.user1.avatar};
                else
                    obj = {"id": id.user2.userId, "name": id.user2.name, "avatar": id.user2.avatar};
                mp.set(id.conversationId, obj);
               convId.push(id.conversationId); 
            });
        }catch(error){
            console.log("error linkDirectMessage");
        }

        try{
            const data = await this.prismaService.directMessage.findMany({
                where:{
                    privateId: {
                        in: convId
                    },
                },
                orderBy: [{dateMessage: 'desc'}],
                distinct: ['privateId'],
                select:{
                    text : true,
                    dateMessage: true,
                    privateId: true,
                }
            });
            
            data.forEach(item => {
                const obj: object = {"Unseen": 2, "Name": mp.get(item.privateId).name , "lastMsg": item.text , "Date": item.dateMessage, 
                "Avatar": mp.get(item.privateId).avatar , "convId": item.privateId, "group": false };
                arrData.push(obj);
            })
            return arrData;
        }catch(error){
            console.log("error in DirectMessage");
            return ;
        }
    }

    async allContact(user1: number){

        let arrData = [];


        // retrieve last message from direct messages
        const Direct =  await this.allDirectLastMessages(user1);
        Direct.forEach(element =>{
            arrData.push(element);
        })
        // retrieve last message from groups
        const group =  await this.allGroupLastMessages(user1);
  
        group.forEach( element => {
           arrData.push(element);
        });

        console.log("finish here");


    
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
        
       
        let userId;
        try{

            const checkGroup = await this.prismaService.room.findUnique({
            where:{
                RoomId: createROle.roomId
            },
            })
            if (!checkGroup)
                return {"error": "Room Not Found: Please verify the room name and try again", status: HttpStatus.NOT_FOUND};
            userId = await this.findUserByname(createROle.userName);
            if (!userId)
                return {"error" : "user not found", status: HttpStatus.NOT_FOUND};
            //console.log("userId is : " , userId.userId);
        } catch(error){
            return {"error" : "Error: Incorrect data type. Please provide the correct type of data", status :HttpStatus.BAD_REQUEST};
        }

        try {

            const isBanned = await this.prismaService.banUser.findFirst({
                where:{
                    RoomId: createROle.roomId,
                    UserId: userId.userId,

                }
            })
            if (isBanned)
                return {"error" : "User is banned and cannot be added to the group again",
                status: HttpStatus.FORBIDDEN};
            
            //console.log("user is : ", userId);
            const data = await this.prismaService.roleUser.create({
                data:{
                    roleUser: {connect: {userId: userId.userId}},
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
        //console.log(arrData);
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
            if (data)
                return {"success" : "Successfully left the group.", status: HttpStatus.OK};
            return {"error": "You are not in this group to leave it", status: HttpStatus.FORBIDDEN}
        }catch(error){
            return {"error": "Error: You are not a member of the group or the provided data is incorrect", status : HttpStatus.BAD_REQUEST}
        }
    }


    async removeGroupe(convId: string, id: number){

        try{
            const findUsrInGrp = await this.findRoleUser(id, convId);

            if (!findUsrInGrp || findUsrInGrp.RoleName != "owner")
                return {"error" : "Permission Denied: You do not have the necessary authorization to remove the group", status: HttpStatus.NOT_FOUND}
        }catch(error){
            return {"error": " the provided data is incorrect", status: HttpStatus.BAD_REQUEST };
        }

        // this can work withoug using try and catch
        try{
            const delRoomMsg = await this.prismaService.roomMessage.deleteMany({
                where:{
                    RoomId: convId,
                }
            });
            const delRoleUser = await this.prismaService.roleUser.deleteMany({
                where:{
                    RoomId: convId,
                }
            })
            // i don't use await to make it remove any time is engine ready to treat it
            const delRoom = await this.prismaService.room.deleteMany({
                where:{
                    RoomId: convId,
                }
            });
            return {"success": true, status: HttpStatus.OK}
        }catch(error){
            return {"error": " the provided data is incorrect", status: HttpStatus.BAD_REQUEST };
        }
    }

    async updateGroupe( updateDto :UpdateGroupDto){

        try{
            const data= await this.findRoleUser(updateDto.UserId, updateDto.RoomId)
            if (!data || data.RoleName != 'owner')
                return {"error": "you are not the owner of this group to update it", status: HttpStatus.BAD_REQUEST};
            if (updateDto.TypeRoom == "protected" && updateDto.password == undefined)
                return {"error": "A password is mandatory for protected group creation", status: HttpStatus.BAD_REQUEST}
        }catch(error){
            return {"error": "the provided data is incorrect", status: HttpStatus.NON_AUTHORITATIVE_INFORMATION};
        }
        try{
            const data  = await this.prismaService.room.update({
                where:{
                    RoomId: updateDto.RoomId,
                },
                data:{
                    TypeRoom: updateDto.TypeRoom,
                    avatar: updateDto.avatar,
                    title: updateDto.title,
                    password: updateDto.password,
                }
            });
        }catch(error){
            return {"error": "the group not updated ", status: HttpStatus.BAD_REQUEST};
        }
        return {"success": true, status: HttpStatus.OK};
    }
}