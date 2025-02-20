import { Module } from '@nestjs/common';

import { SharedModule } from '#shared/shared.module';

import { SalonsController } from '##salons/controllers/salons.controller';
import { SalonsService } from '##salons/services/salons.service';

@Module({
  imports: [SharedModule],
  controllers: [SalonsController],
  providers: [SalonsService],
})
export class SalonsModule {}
