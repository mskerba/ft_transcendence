
import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, BadRequestException, NotFoundException } from '@nestjs/common';
import {ChatService} from './chat.service'
import {CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto} from './DTO/create-groups.dto'
import { STATUS_CODES } from 'http';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    
    // history chat of group
    @Get('group/:id')
    async historyOfGroup(@Param() group: any){
        console.log("group Id : ", group.id);
        //return {"msg": "hello"};
        return this.chatService.historyOfGroup(group.id);
    }
      
    //return all conversation
    @Get(':ide')
    async MyFriends(@Param() param: any) : Promise<any>{
        const id: number = parseInt(param.ide);
        return await this.chatService.MyFriends(id); 
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

    @Post('group/kick')
    kickUser(@Body() punishDto: PunishDto){
         this.chatService.kickUser(punishDto);
       
        throw new NotFoundException();

        return {"success": "good"}
    }

    @Post('group/ban')
    banUser(@Body() punishDto: PunishDto){
        return this.chatService.banUser(punishDto);
    }

    @Post('group/mute')
    muteUser(@Body() muteDto: MuteDto){
        return this.chatService.muteUser(muteDto);
    }

}
