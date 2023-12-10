
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {ChatService} from './chat.service'
import {CreateGroupDto} from './DTO/create-groups.dto'

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    

    @Post()
    createGroup(@Body() createGroupDto: CreateGroupDto){
        console.log("this is the data that come : ", createGroupDto);
        //this.chatService.createGroup(createGroupDto);    
        return {msg: "cool things happen"};
    }  



}
