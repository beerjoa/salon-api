import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { TimeslotDto } from '##salons/dto/timeslot.dto';
import type { TDayTimetable } from '##salons/types/day-timetable.type';
import { EDayOfTheWeekModifier } from '##salons/types/work-hour.type';

export class DayTimetableDto implements TDayTimetable {
  @ApiProperty({
    description: '시작일 식별자',
    example: 1713033600,
  })
  @Expose()
  @IsNumber()
  start_of_day: number;

  @ApiProperty({
    description: '요일 식별자',
    example: 1,
  })
  @Expose()
  @IsEnum(EDayOfTheWeekModifier)
  day_modifier: number;

  @ApiProperty({
    description: '영업일 여부',
    example: false,
  })
  @Expose()
  @IsBoolean()
  is_day_off: boolean;

  @ApiProperty({
    description: '타임슬롯 배열',
    type: TimeslotDto,
    isArray: true,
  })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeslotDto)
  timeslots: TimeslotDto[];
}
