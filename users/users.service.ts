import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class userService {

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (e) {
      if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
        throw new ConflictException('Unique constraint violation: Duplicate value for the unique field.');
      }

      throw e;
    }
  
  }

  findAll() {
    return this.prisma.user.findMany({});
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        userId: id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        userId: id,
      },
    });
  }
}
