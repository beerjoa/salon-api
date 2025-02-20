import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

import type { ITimeSlot } from '#shared/types/time-slot.interface';

export class SalonTimeslotDto implements ITimeSlot {
  @ApiProperty({
    description: '시작 시간',
    example: 1713033600,
  })
  @IsNumber()
  @Expose()
  begin_at: ITimeSlot['begin_at'];

  @ApiProperty({
    description: '종료 시간',
    example: 1713033600,
  })
  @IsNumber()
  @Expose()
  end_at: ITimeSlot['end_at'];
}
