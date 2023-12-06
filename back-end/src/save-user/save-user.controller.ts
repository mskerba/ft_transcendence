
import { Controller, Get, Post, Body } from '@nestjs/common';
import {SaveUserService} from './save-user.service'

@Controller('save-user')
export class SaveUserController {
    constructor(private readonly saveUserService: SaveUserService){}
    
    @Post()
    async saveUser(@Body() body: any ): Promise<any> 
    {
        const { username }  = body;
        try{
            const user = await this.saveUserService.saveUser(username);
            return {success: true, user, redirect: 'chat.html'};
        }
        catch(error){
            console.log("Registration failled");
            return {success: false, error: "Registration fail down"};
        }
    }

    async findUser(username: string): Promise<number>{
        return this.saveUserService.findUser(username);
    }

}
