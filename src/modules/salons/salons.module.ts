import { Module } from '@nestjs/common';

import { SalonsController } from '##salons/controllers/salons.controller';
import { SalonsReservationsService } from '##salons/services/salons-reservations.service';
import { SalonsService } from '##salons/services/salons.service';

@Module({
  controllers: [SalonsController],
  providers: [SalonsService, SalonsReservationsService],
})
export class SalonsModule {}
