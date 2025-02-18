import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Timeslot, TimeslotDto } from './timeslot.dto';

export interface DayTimetable {
  start_of_day: number; // Unixstamp seconds
  day_modifier: number;
  is_day_off: boolean;
  timeslots: Timeslot[];
}

export class DayTimetableDto implements DayTimetable {
  @Expose()
  @IsNumber()
  start_of_day: number;

  @Expose()
  @IsNumber()
  day_modifier: number;

  @Expose()
  @IsBoolean()
  is_day_off: boolean;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeslotDto)
  timeslots: TimeslotDto[];
}
