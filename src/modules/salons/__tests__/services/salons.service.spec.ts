import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';

import { BusinessHoursService } from '#shared/services/business-hours.service';
import { TimeSlotService } from '#shared/services/time-slot.service';
import { ITimeSlot } from '#shared/types/time-slot.interface';

import {
  createBusinessHoursServiceMock,
  createTimeSlotServiceMock,
  getTimeSlotsRequestDtoMock,
} from '##salons/__tests__/mocks/salon.mock';
import { GetTimeSlotsRequestDto } from '##salons/dto/request/get-time-slots.request.dto';
import { SalonsService } from '##salons/services/salons.service';
import {
  ISalonBusinessHours,
  ISalonBusinessHoursInfo,
} from '##salons/types/salon-business-hours.interface';
import { ISalonDayTimetable } from '##salons/types/salon-day-timetable.interface';

describe('SalonsService', () => {
  let salonsService: SalonsService;
  let businessHoursService: jest.Mocked<
    BusinessHoursService<ISalonBusinessHoursInfo>
  >;
  let timeSlotService: jest.Mocked<TimeSlotService<ISalonBusinessHours>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalonsService,
        {
          provide: BusinessHoursService,
          useFactory: createBusinessHoursServiceMock,
        },
        {
          provide: TimeSlotService,
          useFactory: createTimeSlotServiceMock,
        },
      ],
    }).compile();

    salonsService = module.get<SalonsService>(SalonsService);
    businessHoursService = module.get(BusinessHoursService);
    timeSlotService = module.get(TimeSlotService);
  });

  it('SalonsService와 의존 서비스들이 정의되어 있어야 한다', () => {
    expect(salonsService).toBeDefined();
    expect(businessHoursService).toBeDefined();
    expect(timeSlotService).toBeDefined();
  });

  describe('getTimeSlots', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    /**
     * 경우 1: is_ignore_schedule이 false이고, is_ignore_workhour이 false일 때,
     *        각 영업일에 대해 예약 가능한 시간대를 계산하거나 계산하지 않아야 함
     */
    describe('스케줄 무시하지 않고, 영업일을 무시하지 않는 경우', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      const mockedBody: GetTimeSlotsRequestDto = {
        ...getTimeSlotsRequestDtoMock,
        start_day_identifier: '20250217',
        days: 1,
        is_ignore_schedule: false,
        is_ignore_workhour: false,
        timezone_identifier: 'Asia/Seoul',
      };
      const mockedStartDay: DateTime = DateTime.fromFormat(
        mockedBody.start_day_identifier,
        'yyyyMMdd',
        { zone: mockedBody.timezone_identifier },
      );
      it('각 영업일마다 예약 가능한 시간대를 반환해야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: false,
        };
        const mockedTimeSlots: ITimeSlot[] = Array.from(
          { length: mockedBody.days },
          (_, index) => {
            const day: DateTime = mockedStartDay.plus({ days: index });
            return {
              begin_at: day.toSeconds(),
              end_at: day
                .plus({ seconds: mockedBody.service_duration })
                .toSeconds(),
              begin_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
              end_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
            };
          },
        );
        // 모든 호출에 대해 동일한 리턴값 설정
        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);
        jest
          .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
          .mockReturnValue(mockedTimeSlots);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledWith(
          mockedBusinessHoursInfo.businessHours,
          mockedBody.timeslot_interval,
          mockedBody.service_duration,
          mockedBody.is_ignore_schedule,
        );
        expect(result.every((day) => day.is_day_off)).toBe(false);
      });

      it('영업일이 아닌 경우 예약 가능한 시간대가 없어야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: true,
        };
        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).not.toHaveBeenCalled();
        expect(result.every((day) => day.is_day_off)).toBe(true);
        expect(result.every((day) => day.timeslots.length === 0)).toBe(true);
      });
    });

    /**
     * 경우 2: is_ignore_schedule이 true이고, is_ignore_workhour이 false일 때,
     *        각 영업일에 대해 예약 가능한 시간대를 계산하거나 계산하지 않아야 함
     */
    describe('스케줄 무시하며, 영업일을 무시하지 않는 경우', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      const mockedBody: GetTimeSlotsRequestDto = {
        ...getTimeSlotsRequestDtoMock,
        start_day_identifier: '20250301',
        days: 2,
        is_ignore_schedule: true,
        is_ignore_workhour: false,
        timezone_identifier: 'Asia/Seoul',
      };
      const mockedStartDay: DateTime = DateTime.fromFormat(
        mockedBody.start_day_identifier,
        'yyyyMMdd',
        { zone: mockedBody.timezone_identifier },
      );
      it('각 영업일마다 예약 가능한 시간대를 반환해야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: false,
        };
        const mockedTimeSlots: ITimeSlot[] = Array.from(
          { length: mockedBody.days },
          (_, index) => {
            const day: DateTime = mockedStartDay.plus({ days: index });
            return {
              begin_at: day.toSeconds(),
              end_at: day
                .plus({ seconds: mockedBody.service_duration })
                .toSeconds(),
              begin_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
              end_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
            };
          },
        );

        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);
        jest
          .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
          .mockReturnValue(mockedTimeSlots);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledWith(
          mockedBusinessHoursInfo.businessHours,
          mockedBody.timeslot_interval,
          mockedBody.service_duration,
          mockedBody.is_ignore_schedule,
        );
        expect(result.every((day) => day.is_day_off)).toBe(false);
        expect(result.every((day) => day.timeslots.length > 0)).toBe(true);
      });

      it('영업일이 아닌 경우 예약 가능한 시간대가 없어야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: true,
        };
        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).not.toHaveBeenCalled();
        expect(result.every((day) => day.is_day_off)).toBe(true);
        expect(result.every((day) => day.timeslots.length === 0)).toBe(true);
      });
    });

    /**
     * 경우 3: is_ignore_schedule이 true이고, is_ignore_workhour이 true일 때,
     *        각 영업일에 대해 예약 가능한 시간대를 계산하거나 계산하지 않아야 함
     */
    describe('스케줄 무시하지 않고, 영업일을 무시하는 경우', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      const mockedBody: GetTimeSlotsRequestDto = {
        ...getTimeSlotsRequestDtoMock,
        start_day_identifier: '20250401',
        days: 2,
        service_duration: 3600,
        timeslot_interval: 1800,
        is_ignore_schedule: false,
        is_ignore_workhour: true,
        timezone_identifier: 'Asia/Seoul',
      };
      const mockedStartDay: DateTime = DateTime.fromFormat(
        mockedBody.start_day_identifier,
        'yyyyMMdd',
        { zone: mockedBody.timezone_identifier },
      );
      it('각 영업일마다 예약 가능한 시간대를 반환해야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: false,
        };

        const mockedTimeSlots: ITimeSlot[] = Array.from(
          { length: mockedBody.days },
          (_, index) => {
            const day: DateTime = mockedStartDay.plus({ days: index });
            return {
              begin_at: day.toSeconds(),
              end_at: day
                .plus({ seconds: mockedBody.service_duration })
                .toSeconds(),
              begin_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
              end_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
            };
          },
        );

        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);
        jest
          .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
          .mockReturnValue(mockedTimeSlots);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledWith(
          mockedBusinessHoursInfo.businessHours,
          mockedBody.timeslot_interval,
          mockedBody.service_duration,
          mockedBody.is_ignore_schedule,
        );
        expect(result.every((day) => day.is_day_off)).toBe(false);
        expect(result.every((day) => day.timeslots.length > 0)).toBe(true);
      });

      it('영업일이 아닌 경우 예약 가능한 시간대가 없어야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: true,
        };
        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).not.toHaveBeenCalled();
        expect(result.every((day) => day.is_day_off)).toBe(true);
        expect(result.every((day) => day.timeslots.length === 0)).toBe(true);
      });
    });

    /**
     * 경우 4: is_ignore_schedule이 true이고, is_ignore_workhour이 true일 때,
     *        각 영업일에 대해 예약 가능한 시간대를 계산하거나 계산하지 않아야 함
     */
    describe('스케줄 무시하며, 영업일을 무시하는 경우', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      const mockedBody: GetTimeSlotsRequestDto = {
        ...getTimeSlotsRequestDtoMock,
        start_day_identifier: '20250501',
        days: 2,
        service_duration: 3600,
        timeslot_interval: 1800,
        is_ignore_schedule: true,
        is_ignore_workhour: true,
        timezone_identifier: 'Asia/Seoul',
      };
      const mockedStartDay: DateTime = DateTime.fromFormat(
        mockedBody.start_day_identifier,
        'yyyyMMdd',
        { zone: mockedBody.timezone_identifier },
      );
      it('각 영업일마다 예약 가능한 시간대를 반환해야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: false,
        };

        const mockedTimeSlots: ITimeSlot[] = Array.from(
          { length: mockedBody.days },
          (_, index) => {
            const day: DateTime = mockedStartDay.plus({ days: index });
            return {
              begin_at: day.toSeconds(),
              end_at: day
                .plus({ seconds: mockedBody.service_duration })
                .toSeconds(),
              begin_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
              end_at_formatted: day.toFormat('yyyyMMdd HH:mm:ss'),
            };
          },
        );

        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);
        jest
          .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
          .mockReturnValue(mockedTimeSlots);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).toHaveBeenCalledWith(
          mockedBusinessHoursInfo.businessHours,
          mockedBody.timeslot_interval,
          mockedBody.service_duration,
          mockedBody.is_ignore_schedule,
        );
        expect(result.every((day) => day.is_day_off)).toBe(false);
        expect(result.every((day) => day.timeslots.length > 0)).toBe(true);
      });

      it('영업일이 아닌 경우 예약 가능한 시간대가 없어야 한다', () => {
        const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
          businessHours: {
            openTime: mockedStartDay.startOf('day'),
            closeTime: mockedStartDay.endOf('day'),
          },
          isDayOff: true,
        };
        jest
          .spyOn(businessHoursService, 'resolveBusinessHoursForDay')
          .mockReturnValue(mockedBusinessHoursInfo);

        const result: ISalonDayTimetable[] =
          salonsService.getTimeSlots(mockedBody);

        expect(result).toBeDefined();
        expect(result.length).toBe(mockedBody.days);
        expect(
          businessHoursService.resolveBusinessHoursForDay,
        ).toHaveBeenCalledTimes(mockedBody.days);
        expect(
          timeSlotService.calculateTimeSlotsForBusinessHours,
        ).not.toHaveBeenCalled();
        expect(result.every((day) => day.is_day_off)).toBe(true);
        expect(result.every((day) => day.timeslots.length === 0)).toBe(true);
      });
    });
  });
});
