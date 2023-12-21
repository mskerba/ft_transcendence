import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) : Promise<UserEntity> {
    return new UserEntity(await this.userService.create(createUserDto));
  }
  
  @Get()
  async findAll(@Req() req) : Promise<UserEntity> {
    return new UserEntity(req.user);
  }

  @Get(':id') 
  async findOne(@Param('id', ParseIntPipe) id: number) : Promise<UserEntity> {
    return new UserEntity(await this.userService.findOne(id));
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) : Promise<UserEntity> {
    return new UserEntity(await this.userService.update(id, updateUserDto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) : Promise<UserEntity> {
    return new UserEntity(await this.userService.remove(id));
  }
}
