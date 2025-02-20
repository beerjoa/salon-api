import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';

import {
  MOCKED_DATE,
  MOCKED_WORK_HOUR,
} from '#shared/__tests__/mocks/business-hours.mock';
import { BusinessHoursService } from '#shared/services/business-hours.service';
import { IBusinessHours } from '#shared/types/business-hours.interface';

import { ISalonBusinessHoursInfo } from '##salons/types/salon-business-hours.interface';

describe('BusinessHoursService', () => {
  let businessHoursService: BusinessHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessHoursService],
    }).compile();

    businessHoursService =
      module.get<BusinessHoursService>(BusinessHoursService);
  });

  it('BusinessHoursService와 의존 서비스들이 정의되어 있어야 한다', () => {
    expect(businessHoursService).toBeDefined();
  });

  describe('resolveBusinessHoursForDay', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    /**
     * Case 1: isIgnoreWorkHour가 true인 경우, 전체 일자의 영업 시간을 반환
     */
    it('영업 시간을 무시할 경우, 특정 날짜의 전체 영업 시간을 반환해야 한다', () => {
      const mockedBusinessHours: IBusinessHours = {
        openTime: MOCKED_DATE.startOf('day'),
        closeTime: MOCKED_DATE.endOf('day'),
      };
      const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
        businessHours: mockedBusinessHours,
        isDayOff: expect.any(Boolean),
      };
      const result = businessHoursService.resolveBusinessHoursForDay(
        MOCKED_DATE,
        true,
      );
      expect(result).toEqual(mockedBusinessHoursInfo);
    });

    /**
     * Case 2: isIgnoreWorkHour가 false인 경우, 워크 아워 정보를 기반으로 영업 시간을 반환
     */
    it('영업 시간을 무시하지 않을 경우, 특정 날짜의 워크 아워 기준 영업 시간을 반환해야 한다', () => {
      const mockedBusinessHours: IBusinessHours = {
        openTime: DateTime.fromSeconds(MOCKED_WORK_HOUR.open_interval),
        closeTime: DateTime.fromSeconds(MOCKED_WORK_HOUR.close_interval),
      };
      const mockedBusinessHoursInfo: ISalonBusinessHoursInfo = {
        businessHours: mockedBusinessHours,
        isDayOff: expect.any(Boolean),
      };
      jest
        .spyOn(businessHoursService as any, 'getWorkHourForDay')
        .mockReturnValue(MOCKED_WORK_HOUR);
      jest
        .spyOn(businessHoursService as any, 'getBusinessHours')
        .mockReturnValue(mockedBusinessHours);

      const result = businessHoursService.resolveBusinessHoursForDay(
        MOCKED_DATE,
        false,
      );
      expect(result).toEqual(mockedBusinessHoursInfo);
    });
  });
});
