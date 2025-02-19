import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsTimeZone,
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
  @ApiProperty({
    type: String,
    description: '시작일 식별자',
    example: '20240101',
  })
  @IsDateString()
  @IsNotEmpty()
  @Expose()
  start_day_identifier: string;

  @ApiProperty({
    type: String,
    description: '타임존 식별자',
    example: 'Asia/Seoul',
  })
  @IsTimeZone()
  @IsNotEmpty()
  @Expose()
  timezone_identifier: string;

  @ApiProperty({
    type: Number,
    description: '서비스 제공 시간, 초 단위',
    default: 1800,
  })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  service_duration: number;

  @ApiPropertyOptional({
    type: Number,
    description: '시작일을 기준으로 몇 일치를 반환할지 지정',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  days: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: '타임슬롯 간격, 초 단위',
    default: 1800,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  timeslot_interval: number = 1800;

  @ApiPropertyOptional({
    type: Boolean,
    description: '예약된 이벤트 데이터 고려 여부',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  is_ignore_schedule: boolean = false;

  @ApiPropertyOptional({
    type: Boolean,
    description: '영업시간 데이터 고려 여부',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  is_ignore_workhour: boolean = false;
}
