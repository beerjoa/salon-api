import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { BusinessHoursService } from '#shared/services/business-hours.service';
import { TimeSlotService } from '#shared/services/time-slot.service';
import { IEvent } from '#shared/types/event.interface';
import { IWorkHour } from '#shared/types/work-hour.interface';

import { GetTimeSlotsRequestDto } from '##salons/dto/request/get-time-slots.request.dto';
import { SalonsService } from '##salons/services/salons.service';
import {
  ISalonBusinessHours,
  ISalonBusinessHoursInfo,
} from '##salons/types/salon-business-hours.interface';

/**
 * 기본 영업시간 데이터, 필요에 따라 추가 및 수정 가능
 * @type {IWorkHour[]}
 */
export const defaultWorkHours: IWorkHour[] = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'workhours.json'), 'utf8'),
);

/**
 * 기본 이벤트 데이터
 * @type {IEvent[]}
 */
export const defaultEvents: IEvent[] = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'events.json'), 'utf8'),
);

export const createSalonsServiceMock = (): jest.Mocked<SalonsService> => {
  const salonsServiceMock: jest.Mocked<SalonsService> = {
    getTimeSlots: jest.fn(),
  } as unknown as jest.Mocked<SalonsService>;
  return salonsServiceMock;
};

/**
 * 비즈니스 시간 서비스의 기본 모킹 팩토리 함수
 * @returns {jest.Mocked<BusinessHoursService<ISalonBusinessHoursInfo>>} 모킹된 인스턴스
 */
export const createBusinessHoursServiceMock = (): jest.Mocked<
  BusinessHoursService<ISalonBusinessHoursInfo>
> => {
  const businessHoursServiceMock: jest.Mocked<
    BusinessHoursService<ISalonBusinessHoursInfo>
  > = {
    getBusinessHours: jest.fn(),
    resolveBusinessHoursForDay: jest.fn(),
    getWorkHourForDay: jest.fn(),
    // 테스트 목적상 직접 할당 (실제 동작과 동일)
    workHours: defaultWorkHours,
  } as unknown as jest.Mocked<BusinessHoursService<ISalonBusinessHoursInfo>>;
  return businessHoursServiceMock;
};

/**
 * 타임슬롯 서비스의 기본 모킹 팩토리 함수
 * @returns {jest.Mocked<TimeSlotService<ISalonBusinessHours>>} 모킹된 인스턴스
 */
export const createTimeSlotServiceMock = (): jest.Mocked<
  TimeSlotService<ISalonBusinessHours>
> => {
  const timeSlotServiceMock: jest.Mocked<TimeSlotService<ISalonBusinessHours>> =
    {
      calculateTimeSlotsForBusinessHours: jest.fn(),
      isTimeSlotAvailable: jest.fn(),
      events: [],
    } as unknown as jest.Mocked<TimeSlotService<ISalonBusinessHours>>;
  return timeSlotServiceMock;
};

/**
 * DTO 모킹 기본값
 * @type {GetTimeSlotsRequestDto}
 */
export const getTimeSlotsRequestDtoMock: GetTimeSlotsRequestDto = {
  start_day_identifier: '20240101',
  timezone_identifier: 'Asia/Seoul',
  service_duration: 1800,
  days: 1,
  timeslot_interval: 1800,
  is_ignore_schedule: false,
  is_ignore_workhour: false,
};
