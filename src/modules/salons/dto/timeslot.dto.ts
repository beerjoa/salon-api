import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

import type { TTimeslot } from '##salons/types/timeslot.type';

export class TimeslotDto implements TTimeslot {
  @ApiProperty({
    description: '시작 시간',
    example: 1713033600,
  })
  @IsNumber()
  @Expose()
  begin_at: TTimeslot['begin_at'];

  @ApiProperty({
    description: '종료 시간',
    example: 1713033600,
  })
  @IsNumber()
  @Expose()
  end_at: TTimeslot['end_at'];

  @ApiProperty({
    description: '시작 시간 표시 형식',
    example: '2024-04-10 10:00:00',
  })
  @IsString()
  @Expose()
  begin_at_formatted: TTimeslot['begin_at_formatted'];

  @ApiProperty({
    description: '종료 시간 표시 형식',
    example: '2024-04-10 11:00:00',
  })
  @IsString()
  @Expose()
  end_at_formatted: TTimeslot['end_at_formatted'];
}
