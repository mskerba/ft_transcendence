import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AvatarService {

  constructor(private userService: UserService) { }


  private readonly storagePath = './avatar';


  async storeAvatar(user: UserEntity, file: Express.Multer.File) {
    try {
      if (user.avatar != 'default.svg') fs.unlinkSync(path.join(this.storagePath, user.avatar));

    } catch (error) {}
    
    const filename = `${user.userId}${path.extname(file.originalname)}`;
    const filePath = path.join(this.storagePath, filename);

    fs.writeFileSync(filePath, file.buffer);
    return await this.userService.update(user.userId, { avatar: filename });
  }
}
