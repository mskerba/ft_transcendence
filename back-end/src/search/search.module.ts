import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [PrismaModule]
})
export class SearchModule {}
