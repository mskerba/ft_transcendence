
import { Controller, Get, Post, Body, Param, HttpStatus, Req, HttpCode, BadRequestException, NotFoundException, HttpException } from '@nestjs/common';
import {ChatService} from './chat.service'
import {CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto} from './DTO/create-groups.dto'
import { STATUS_CODES } from 'http';
import { da } from '@faker-js/faker';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    
    
    //return all conversation
    @Get(':ide')
    async MyFriends(@Param() param: any) : Promise<any>{
        //const user: UserEntity = req.user;
        
        const id: number = parseInt(param.ide);
        return await this.chatService.MyFriends(id); 
    }
    
    // history chat of group
    @Get("group/:userId/:groupId")
    async historyOfGroup(@Param() group: any){
        console.log("group Id : ", group.groupId);
        //return {"msg": "hello"};
    

        let id : number = parseInt(group.userId);
        
        const isUserInGroup = await this.chatService.findUserInGroup(id, group.groupId);
        if (isUserInGroup.error !== undefined)
            return isUserInGroup;
        const historyGroup = await this.chatService.historyOfGroup(group.groupId);
        if (historyGroup)
            return historyGroup;
        return {"error": "message in this group occured an error", "status": HttpStatus.NOT_ACCEPTABLE};

    }

    // about group
    @Get("about/:convId/:id")
    async about(@Param() param: any){
        console.log("about convId is : ", param.convId);
        
    
      return await  this.chatService.about(param.convId, +param.id);
    }
    // return chat history of private messages
    @Get(":id1/:id2")
    async ChatHistory(@Param() param: any): Promise<any>
    {
        const id1: number = parseInt(param.id1);
    
        console.log("first id : ", id1, " second id: ", param.id2);
        return await this.chatService.chatHistory(id1, param.id2);
    }
    
    // create Group    
    @Post()
    async createGroup(@Body() createGroupDto: CreateGroupDto){

        const data = await this.chatService.createGroup(createGroupDto);    
        if (data.error !== undefined)
            return data;
        return data;
    }

    // add user to the group
    @Post('group/add')
    addToGroup(@Body() creatRole: CreateRoleUserDto){
        return this.chatService.addTogroup(creatRole);
    }

    // kick user from group
    @Post('group/kick')
    async kickUser(@Body() punishDto: PunishDto){
        const data = await this.chatService.kickUser(punishDto);
        if (data.error !== undefined)
            throw new HttpException(data.error, HttpStatus.NOT_FOUND);
        return data;
    }

    // ban user from group
    @Post('group/ban')
    async banUser(@Body() punishDto: PunishDto){
        const data = await this.chatService.banUser(punishDto);
        if (data.error !== undefined)
            throw new HttpException(data.error, data.status);
        return data;
    }

    // mute user from group
    @Post('group/mute')
    async muteUser(@Body() muteDto: MuteDto){
        const data = await this.chatService.muteUser(muteDto);
        if (data.error !== undefined)
            throw new HttpException(data.error, data.status);
        return data;
    }

}
