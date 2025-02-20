import { Test, TestingModule } from '@nestjs/testing';

import {
  MOCKED_BUSINESS_HOURS,
  MOCKED_SERVICE_DURATION,
  MOCKED_SLOT_INTERVAL,
} from '#shared/__tests__/mocks/time-slot.mock';
import { TimeSlotService } from '#shared/services/time-slot.service';
import { ITimeSlot } from '#shared/types/time-slot.interface';

describe('TimeSlotService', () => {
  let timeSlotService: TimeSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeSlotService],
    }).compile();

    timeSlotService = module.get<TimeSlotService>(TimeSlotService);
  });

  it('TimeSlotService와 의존 서비스들이 정의되어 있어야 한다', () => {
    expect(timeSlotService).toBeDefined();
  });

  describe('calculateTimeSlotsForBusinessHours', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    /**
     * Case 1: isIgnoreSchedule가 true이고, 타임슬롯이 예약 가능한 경우
     */
    it('isIgnoreSchedule가 true이고, 타임슬롯이 예약 가능한 경우, 타임슬롯을 반환해야 한다', () => {
      const mockedTimeSlots: ITimeSlot[] = expect.any(Array<ITimeSlot>);
      jest
        .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
        .mockReturnValue(mockedTimeSlots);

      const result: ITimeSlot[] =
        timeSlotService.calculateTimeSlotsForBusinessHours(
          MOCKED_BUSINESS_HOURS,
          MOCKED_SLOT_INTERVAL,
          MOCKED_SERVICE_DURATION,
          true,
        );
      expect(
        timeSlotService.calculateTimeSlotsForBusinessHours,
      ).toHaveBeenCalledWith(
        MOCKED_BUSINESS_HOURS,
        MOCKED_SLOT_INTERVAL,
        MOCKED_SERVICE_DURATION,
        true,
      );
      expect(result).toEqual(mockedTimeSlots);
    });

    /**
     * Case 2: isIgnoreSchedule가 true이고, 타임슬롯이 예약 가능하지 않은 경우
     */
    it('isIgnoreSchedule가 true이고, 모든 타임슬롯이 예약 가능하지 않은 경우, 빈 배열을 반환해야 한다', () => {
      jest
        .spyOn(timeSlotService as any, 'isTimeSlotAvailable')
        .mockImplementation(() => false);

      const mockedTimeSlots: ITimeSlot[] = [];
      jest
        .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
        .mockReturnValue(mockedTimeSlots);

      const result: ITimeSlot[] =
        timeSlotService.calculateTimeSlotsForBusinessHours(
          MOCKED_BUSINESS_HOURS,
          MOCKED_SLOT_INTERVAL,
          MOCKED_SERVICE_DURATION,
          true,
        );
      expect(
        timeSlotService.calculateTimeSlotsForBusinessHours,
      ).toHaveBeenCalledWith(
        MOCKED_BUSINESS_HOURS,
        MOCKED_SLOT_INTERVAL,
        MOCKED_SERVICE_DURATION,
        true,
      );
      expect(result).toEqual(mockedTimeSlots);
    });

    /**
     * Case 3: isIgnoreSchedule가 false이고, 타임슬롯이 예약 가능한 경우
     */
    it('isIgnoreSchedule가 false이고, 타임슬롯이 예약 가능한 경우, 타임슬롯을 반환해야 한다', () => {
      jest
        .spyOn(timeSlotService as any, 'isTimeSlotAvailable')
        .mockImplementation(() => true);

      const mockedTimeSlots: ITimeSlot[] = expect.any(Array<ITimeSlot>);
      jest
        .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
        .mockReturnValue(mockedTimeSlots);

      const result: ITimeSlot[] =
        timeSlotService.calculateTimeSlotsForBusinessHours(
          MOCKED_BUSINESS_HOURS,
          MOCKED_SLOT_INTERVAL,
          MOCKED_SERVICE_DURATION,
          false,
        );
      expect(
        timeSlotService.calculateTimeSlotsForBusinessHours,
      ).toHaveBeenCalledWith(
        MOCKED_BUSINESS_HOURS,
        MOCKED_SLOT_INTERVAL,
        MOCKED_SERVICE_DURATION,
        false,
      );
      expect(result).toEqual(mockedTimeSlots);
    });

    /**
     * Case 4: isIgnoreSchedule가 false이고, 타임슬롯이 예약 가능하지 않은 경우
     */
    it('isIgnoreSchedule가 false이고, 모든 타임슬롯이 예약 가능하지 않은 경우, 빈 배열을 반환해야 한다', () => {
      jest
        .spyOn(timeSlotService as any, 'isTimeSlotAvailable')
        .mockImplementation(() => false);

      const mockedTimeSlots: ITimeSlot[] = [];
      jest
        .spyOn(timeSlotService, 'calculateTimeSlotsForBusinessHours')
        .mockReturnValue(mockedTimeSlots);

      const result: ITimeSlot[] =
        timeSlotService.calculateTimeSlotsForBusinessHours(
          MOCKED_BUSINESS_HOURS,
          MOCKED_SLOT_INTERVAL,
          MOCKED_SERVICE_DURATION,
          false,
        );
      expect(
        timeSlotService.calculateTimeSlotsForBusinessHours,
      ).toHaveBeenCalledWith(
        MOCKED_BUSINESS_HOURS,
        MOCKED_SLOT_INTERVAL,
        MOCKED_SERVICE_DURATION,
        false,
      );
      expect(result).toEqual(mockedTimeSlots);
    });
  });
});
