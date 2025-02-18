import { Module } from '@nestjs/common';
import { SalonsService } from './services/salons.service';
import { SalonsController } from './controllers/salons.controller';

@Module({
  controllers: [SalonsController],
  providers: [SalonsService],
})
export class SalonsModule {}
