import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export interface Timeslot {
  begin_at: number; // Unixstamp seconds
  end_at: number; // Unixstamp seconds
  begin_at_formatted: string;
  end_at_formatted: string;
}

export class TimeslotDto implements Timeslot {
  @IsNumber()
  @Expose()
  begin_at: number;

  @IsNumber()
  @Expose()
  end_at: number;

  @IsString()
  @Expose()
  begin_at_formatted: string;

  @IsString()
  @Expose()
  end_at_formatted: string;
}
