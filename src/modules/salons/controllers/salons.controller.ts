import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetTimeSlotsRequestDto } from '##salons/dto/request/get-time-slots.request.dto';
import { GetTimeSlotsResponseDto } from '##salons/dto/response/get-time-slots.response.dto';
import { SalonDayTimetableDto } from '##salons/dto/salon-day-timetable.dto';
import { SalonsService } from '##salons/services/salons.service';

/**
 * Controller for Salons
 */
@Controller('salons')
@ApiTags('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Post('getTimeSlots')
  @HttpCode(200)
  @ApiBody({ type: GetTimeSlotsRequestDto })
  @ApiResponse({
    status: 200,
    description: '타임슬롯 조회',
    type: SalonDayTimetableDto,
    isArray: true,
  })
  @ApiOperation({
    summary: '타임슬롯 조회',
    description: '타임슬롯 조회',
    operationId: 'getTimeSlots',
  })
  getTimeSlots(@Body() body: GetTimeSlotsRequestDto): GetTimeSlotsResponseDto {
    return this.salonsService.getTimeSlots(body);
  }
}
