
import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, BadRequestException, NotFoundException, HttpException } from '@nestjs/common';
import {ChatService} from './chat.service'
import {CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto} from './DTO/create-groups.dto'
import { STATUS_CODES } from 'http';
import { da } from '@faker-js/faker';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    
    
    //return all conversation
    @Get(':ide')
    async MyFriends(@Param() param: any) : Promise<any>{
        const id: number = parseInt(param.ide);
        return await this.chatService.MyFriends(id); 
    }
    
    // history chat of group
    @Get('group/:id')
    async historyOfGroup(@Param() group: any){
        console.log("group Id : ", group.id);
        //return {"msg": "hello"};
        return this.chatService.historyOfGroup(group.id);
    }

    // return chat history of private messages
    @Get(":id1/:id2")
    async ChatHistory(@Param() param: any): Promise<any>
    {
        const id1: number = parseInt(param.id1);
        const id2: number = parseInt(param.id2);

        console.log("first id : ", id1, " second id: ", id2);
        return this.chatService.chatHistory(id1, id2);
    }

    // create Group    
    @Post()
    createGroup(@Body() createGroupDto: CreateGroupDto){
        console.log("this is the data that come : ", createGroupDto);
        return this.chatService.createGroup(createGroupDto);    
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
