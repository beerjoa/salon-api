import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { SalonsService } from '../services/salons.service';
import { GetTimeSlotsRequestDto } from '../dto/request/get-time-slots.request.dto';
import { DayTimetableDto } from '../dto/day-timetable.dto';
import { ArrayTransformInterceptor } from '../../../common/interceptors/array-transform.interceptor';
import { GetTimeSlotsResponseDto } from '../dto/response/get-time-slots.response.dto';

/**
 * Controller for Salons
 */
@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Post('getTimeSlots')
  @HttpCode(200)
  @UseInterceptors(new ArrayTransformInterceptor(DayTimetableDto))
  getTimeSlots(@Body() body: GetTimeSlotsRequestDto): GetTimeSlotsResponseDto {
    return this.salonsService.getTimeSlots(body);
  }
}
