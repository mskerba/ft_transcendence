import { Controller, Get, Req, Res, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { diskStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Req() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const user: UserEntity = req.user;

    return await this.avatarService.storeAvatar(user, file);
  }

  @Get(':userAvatar')
  async serveAvatar(
    @Param('userAvatar') userAvatar: string,
    @Req() req,
    @Res() res
  ){
    const user: UserEntity = req.user;
    const filePath: string = `/app/avatar/${userAvatar}`;

    console.log('AVATAR1');
    console.log(filePath);
    console.log('AVATAR2');
    
    try {
      // await fs.access(filePath);
      // await fs.access(filePath, fs.constants.R_OK);
      res.sendFile(filePath);
    } catch (error) { }
  }

}
