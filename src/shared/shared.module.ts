import { Module } from '@nestjs/common';

import { BusinessHoursService } from '#shared/services/business-hours.service';
import { TimeSlotService } from '#shared/services/time-slot.service';

@Module({
  providers: [BusinessHoursService, TimeSlotService],
  exports: [BusinessHoursService, TimeSlotService],
})
export class SharedModule {}
