import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
        throw new BadRequestException("this name already exists");
      }

      throw e;
    }
  
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: {
          userId: id,
        },
        data: updateUserDto,
      });
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
        throw new BadRequestException("this name already exists");
      }

      throw e;
    }
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        userId: id,
      },
    });
  }
}
