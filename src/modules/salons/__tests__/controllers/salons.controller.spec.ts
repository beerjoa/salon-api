import { Test, TestingModule } from '@nestjs/testing';
import { SalonsController } from '../../controllers/salons.controller';
import { SalonsService } from '../../services/salons.service';

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
