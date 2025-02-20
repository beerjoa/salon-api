import { Test, TestingModule } from '@nestjs/testing';

import { createSalonsServiceMock } from '##salons/__tests__/mocks/salon.mock';
import { SalonsController } from '##salons/controllers/salons.controller';
import { GetTimeSlotsRequestDto } from '##salons/dto/request/get-time-slots.request.dto';
import { SalonsService } from '##salons/services/salons.service';
import { ISalonDayTimetable } from '##salons/types/salon-day-timetable.interface';

describe('SalonsController', () => {
  let salonsController: SalonsController;
  let salonsService: jest.Mocked<SalonsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonsController],
      providers: [
        {
          provide: SalonsService,
          useFactory: createSalonsServiceMock,
        },
      ],
    }).compile();

    salonsController = module.get<SalonsController>(SalonsController);
    salonsService = module.get(SalonsService);
  });

  it('SalonsController와 의존 서비스들이 정의되어 있어야 한다', () => {
    expect(salonsController).toBeDefined();
    expect(salonsService).toBeDefined();
  });

  it('should be defined', () => {
    expect(salonsController).toBeDefined();
  });

  describe('getTimeSlots', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('필요한 메서드가 정의되어 있어야 한다', () => {
      expect(salonsController.getTimeSlots).toBeDefined();
      expect(salonsService.getTimeSlots).toBeDefined();
    });

    const mockedGetTimeSlotsRequestDto: GetTimeSlotsRequestDto = {
      start_day_identifier: '20250216',
      days: 3,
      service_duration: 3600,
      timeslot_interval: 1800,
      is_ignore_schedule: false,
      is_ignore_workhour: false,
      timezone_identifier: 'Asia/Seoul',
    };

    const mockDayTimetables = expect.any(Array<ISalonDayTimetable>);

    describe('영업 시간 조회가 정상적으로 이루어지는 경우', () => {
      beforeEach(() => {
        jest
          .spyOn(salonsService, 'getTimeSlots')
          .mockReturnValueOnce(mockDayTimetables);
      });
      it('SalonsController의 getTimeSlots 메서드가 정상적으로 호출되어야 한다', () => {
        const result = salonsController.getTimeSlots(
          mockedGetTimeSlotsRequestDto,
        );
        expect(salonsService.getTimeSlots).toHaveBeenCalledWith(
          mockedGetTimeSlotsRequestDto,
        );
        expect(result).toMatchObject(mockDayTimetables);
      });
    });
  });
});
