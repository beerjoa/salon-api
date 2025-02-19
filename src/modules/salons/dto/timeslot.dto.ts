import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export interface Timeslot {
  begin_at: number; // Unixstamp seconds
  end_at: number; // Unixstamp seconds
  begin_at_formatted: string;
  end_at_formatted: string;
}

export class TimeslotDto implements Timeslot {
  @ApiProperty({
    description: '시작 시간',
    example: 1713033600,
  })
  @IsNumber()
  @Expose()
  begin_at: number;

  @ApiProperty({
    description: '종료 시간',
    example: 1713033600,
  })
  @IsNumber()
  @Expose()
  end_at: number;

  @ApiProperty({
    description: '시작 시간 표시 형식',
    example: '2024-04-10 10:00:00',
  })
  @IsString()
  @Expose()
  begin_at_formatted: string;

  @ApiProperty({
    description: '종료 시간 표시 형식',
    example: '2024-04-10 11:00:00',
  })
  @IsString()
  @Expose()
  end_at_formatted: string;
}
