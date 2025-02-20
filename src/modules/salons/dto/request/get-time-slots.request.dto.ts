import { Expose } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

// import from assignment
interface RequestBody {
  start_day_identifier: string;
  timezone_identifier: string;
  service_duration: number;
  days?: number;
  timeslot_interval?: number;
  is_ignore_schedule?: boolean;
  is_ignore_workhour?: boolean;
}

export class GetTimeSlotsRequestDto implements RequestBody {
  @IsString()
  @IsNotEmpty()
  @Expose()
  start_day_identifier: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  timezone_identifier: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  service_duration: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  days?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  timeslot_interval?: number;

  @IsBoolean()
  @IsOptional()
  @Expose()
  is_ignore_schedule?: boolean;

  @IsBoolean()
  @IsOptional()
  @Expose()
  is_ignore_workhour?: boolean;
}
