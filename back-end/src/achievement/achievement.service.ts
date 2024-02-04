import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementService {

  constructor(private prisma: PrismaService) { }

  async create(userId: number, achievementName: string, achievementDescription: string) {
    try {
    
      const existingAchievement = await this.prisma.achievement.findFirst({
        where: {
          userId,
          name: achievementName,
        },
      });
  
      if (!existingAchievement) {
        const newAchievement = await this.prisma.achievement.create({
          data: {
            userId,
            name: achievementName,
            description: achievementDescription,
          },
        });
        return newAchievement;
      } else {
        return existingAchievement;
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  }

  async findAll(userId: number) {
    try {
      const userAchievements = await this.prisma.achievement.findMany({
        where: {
          userId,
        },
      });
  
      return userAchievements;
    } catch (error) {
      console.error('Error retrieving user achievements:', error);
    }
  }

}
