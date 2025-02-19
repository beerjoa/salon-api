import { Test, TestingModule } from '@nestjs/testing';
import { SalonsController } from '##salons/controllers/salons.controller';
import { SalonsService } from '##salons/services/salons.service';

describe('SalonsController', () => {
  let controller: SalonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonsController],
      providers: [SalonsService],
    }).compile();

    controller = module.get<SalonsController>(SalonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
