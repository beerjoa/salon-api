import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export interface Timeslot {
  begin_at: number; // Unixstamp seconds
  end_at: number; // Unixstamp seconds
}

export class TimeslotDto implements Timeslot {
  @IsNumber()
  @Expose()
  begin_at: number;

  @IsNumber()
  @Expose()
  end_at: number;
}
