import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { EDayOfTheWeekModifier } from '#shared/types/work-hour.interface';

import { SalonTimeslotDto } from '##salons/dto/salon-timeslot.dto';
import type { ISalonDayTimetable } from '##salons/types/salon-day-timetable.interface';

export class SalonDayTimetableDto implements ISalonDayTimetable {
  @ApiProperty({
    description: '시작일 식별자',
    example: 1713033600,
  })
  @Expose()
  @IsNumber()
  start_of_day: ISalonDayTimetable['start_of_day'];

  @ApiProperty({
    description: '요일 식별자',
    enum: EDayOfTheWeekModifier,
    example: EDayOfTheWeekModifier.mon,
  })
  @Expose()
  @IsEnum(EDayOfTheWeekModifier)
  day_modifier: ISalonDayTimetable['day_modifier'];

  @ApiProperty({
    description: '영업일 여부',
    example: false,
  })
  @Expose()
  @IsBoolean()
  is_day_off: ISalonDayTimetable['is_day_off'];

  @ApiProperty({
    description: '타임슬롯 배열',
    type: SalonTimeslotDto,
    isArray: true,
  })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalonTimeslotDto)
  timeslots: ISalonDayTimetable['timeslots'];
}
