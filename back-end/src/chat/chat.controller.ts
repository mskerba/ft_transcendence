
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {ChatService} from './chat.service'

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}
    





}
