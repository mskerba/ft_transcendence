import { Test, TestingModule } from '@nestjs/testing';
import { SaveUserController } from './chat.controller';

describe('SaveUserController', () => {
  let controller: SaveUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveUserController],
    }).compile();

    controller = module.get<SaveUserController>(SaveUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
