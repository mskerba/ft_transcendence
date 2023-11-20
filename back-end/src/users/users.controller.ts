import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from 'src/common/decorators';

@Controller('users')
@Public()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) : Promise<UserEntity> {
    return new UserEntity(await this.usersService.create(createUserDto));
  }
  
  @Get()
  async findAll() : Promise<UserEntity[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user)); 
  }

  @Get(':id') 
  async findOne(@Param('id', ParseIntPipe) id: number) : Promise<UserEntity> {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) : Promise<UserEntity> {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) : Promise<UserEntity> {
    return new UserEntity(await this.usersService.remove(id));
  }
}
