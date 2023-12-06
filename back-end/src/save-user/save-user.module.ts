import { Module } from '@nestjs/common';
import {SaveUserService} from './save-user.service'

@Module({
    exports: [SaveUserModule]
})
export class SaveUserModule {}
