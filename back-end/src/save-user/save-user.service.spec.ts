import { Test, TestingModule } from '@nestjs/testing';
import { SaveUserService } from './save-user.service';

describe('SaveUserService', () => {
  let service: SaveUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveUserService],
    }).compile();

    service = module.get<SaveUserService>(SaveUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
