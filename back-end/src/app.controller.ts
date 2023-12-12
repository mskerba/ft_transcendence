import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHell(){
    return this.appService.getHello();
  }
  // @Get()
  // getHello(@Res() response: Response): void {
  //   const file = path.join(__dirname, '../..', '/html/index.html');
  //   response.sendFile(file);
  // }
}
