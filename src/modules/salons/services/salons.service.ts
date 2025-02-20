import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { BusinessHoursService } from '#shared/services/business-hours.service';
import { TimeSlotService } from '#shared/services/time-slot.service';

import { GetTimeSlotsRequestDto } from '##salons/dto/request/get-time-slots.request.dto';
import type {
  ISalonBusinessHours,
  ISalonBusinessHoursInfo,
} from '##salons/types/salon-business-hours.interface';
import type { ISalonDayTimetable } from '##salons/types/salon-day-timetable.interface';

/**
 * 살롱 서비스
 * 기존 비즈니스 로직에서 공통 서비스를 주입받아 사용
 * @class SalonsService
 *
 * @constructor
 * @param {BusinessHoursService<ISalonBusinessHoursInfo>} businessHoursService - 영업시간 서비스
 * @param {TimeSlotService<ISalonBusinessHours>} timeSlotService - 타임슬롯 서비스
 */
@Injectable()
export class SalonsService {
  constructor(
    private readonly businessHoursService: BusinessHoursService<ISalonBusinessHoursInfo>,
    private readonly timeSlotService: TimeSlotService<ISalonBusinessHours>,
  ) {}

  /**
   * 예약 가능한 타임슬롯 조회
   * @param {GetTimeSlotsRequestDto} body - 요청 본문
   * @returns {Array<ISalonDayTimetable>} 예약 가능한 타임슬롯 배열
   */
  public getTimeSlots(body: GetTimeSlotsRequestDto): Array<ISalonDayTimetable> {
    const dayTimetables: Array<ISalonDayTimetable> = [];
    const startDay: DateTime = DateTime.fromFormat(
      body.start_day_identifier,
      'yyyyMMdd',
      { zone: body.timezone_identifier },
    );
    for (let i = 0; i < body.days; i++) {
      const currentDay: DateTime = startDay.plus({ days: i });
      const { businessHours, isDayOff } =
        this.businessHoursService.resolveBusinessHoursForDay(
          currentDay,
          body.is_ignore_workhour,
        );
      const dayTimetable: ISalonDayTimetable = {
        start_of_day: currentDay.toSeconds(),
        day_modifier: currentDay.weekday,
        is_day_off: isDayOff,
        timeslots: [],
      };
      if (!isDayOff) {
        dayTimetable.timeslots =
          this.timeSlotService.calculateTimeSlotsForBusinessHours(
            businessHours,
            body.timeslot_interval,
            body.service_duration,
            body.is_ignore_schedule,
          );
      }
      dayTimetables.push(dayTimetable);
    }
    return dayTimetables;
  }
}
