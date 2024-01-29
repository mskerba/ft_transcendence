
import { Controller, Get, Post, Body, Param, HttpStatus, Req, ParseIntPipe, HttpCode, BadRequestException, NotFoundException, HttpException } from '@nestjs/common';
import {ChatService} from './chat.service'
import {CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto, UpdateGroupDto} from './dto/create-groups.dto'
import { STATUS_CODES } from 'http';
import { da } from '@faker-js/faker';
import { UserEntity } from 'src/user/entities/user.entity';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    
    
    
    //return all conversation
    @Get()
    async MyFriends(@Req() req: any) : Promise<any>{
        const user: UserEntity = req.user;
        return await this.chatService.allContact(user.userId); 
    }


    @Get('check-or-create/:friendId')
    async checkOrCreateConv(
        @Req() req: any,
        @Param('friendId', ParseIntPipe) friendId: number,
    ) : Promise<any>{
        const user: UserEntity = req.user;

        let conversationId = await this.chatService.findLinkMessage(user.userId, friendId);
        if (!conversationId) {
            conversationId = await this.chatService.LinkDirectMessage(user.userId, friendId);
        }

        return conversationId;
    }
    
    // history chat of group
    @Get("group/:groupId")
    async historyOfGroup(@Req() req: any, @Param() group: any){
        const user: UserEntity = req.user;
        console.log("group Id : ", group.groupId);
        //return {"msg": "hello"};
    

        let id : number = parseInt(group.userId);
        
        const isUserInGroup = await this.chatService.findUserInGroup(user.userId, group.groupId);
        if (isUserInGroup.error !== undefined)
            return isUserInGroup;
        const historyGroup = await this.chatService.historyOfGroup(group.groupId);
        if (historyGroup)
            return historyGroup;
        return {"error": "message in this group occured an error", "status": HttpStatus.NOT_ACCEPTABLE};

    }


    // leave group
    @Get('leave/:convId')
    async leave(@Req() req: any, @Param() param: any){
        const user: UserEntity = req.user;
        const data = await this.chatService.leaveGroup(param.convId, user.userId);
        if (data.error !== undefined)
            throw new HttpException(data.error, HttpStatus.NOT_FOUND);
        return data;
    }

    // remove group
    @Get('remove/:convId')
    async remove(@Req() req: any, @Param() param: any){
        const user: UserEntity = req.user;
        const data = await this.chatService.removeGroupe(param.convId, user.userId);
        return data;
    }
    // about group
    @Get("about/:convId")
    async about(@Req() req: any, @Param() param: any){
        const user: UserEntity = req.user;
        console.log("about convId is : ", param.convId);

      return await  this.chatService.about(param.convId, user.userId);
    }
    // return chat history of private messages
    @Get(":convId")
    async ChatHistory(@Req() req: any, @Param() param: any): Promise<any>
    {
        const user: UserEntity = req.user;

    
        console.log("first id : ", user.userId, " second id: ", param.convId);
        return await this.chatService.chatHistory(user.userId, param.convId);
    }
    
    // create Group    
    @Post()
    async createGroup(@Body() createGroupDto: CreateGroupDto){

        console.log("creation of group here");
        const data = await this.chatService.createGroup(createGroupDto);
        
        if (data.error !== undefined)
            return data;
        return data;
    }

    // add user to the group
    @Post('group/add')
    async addToGroup(@Body() creatRole: CreateRoleUserDto){
        return  await this.chatService.addTogroup(creatRole);
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
        return data;
    }

    // update group
    @Post('group/update')
    async update(@Body() updateDto: UpdateGroupDto ){
        const data = await this.chatService.updateGroupe(updateDto);
        return data;
    } 


}
