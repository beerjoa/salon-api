import { Injectable } from '@nestjs/common';
import { GetTimeSlotsRequestDto } from '../dto/request/get-time-slots.request.dto';

const MOCK_DATA = [
  {
    start_of_day: 1538697600,
    day_modifier: 2,
    is_day_off: false,
    timeslots: [
      {
        begin_at: 1538740800,
        end_at: 1538744400,
      },
      {
        begin_at: 1538742600,
        end_at: 1538746200,
      },
      {
        begin_at: 1538744400,
        end_at: 1538748000,
      },
    ],
  },
  {
    start_of_day: 1538784000,
    day_modifier: 3,
    is_day_off: false,
    timeslots: [
      {
        begin_at: 1538827200,
        end_at: 1538830800,
      },
      {
        begin_at: 1538829000,
        end_at: 1538832600,
      },
      {
        begin_at: 1538830800,
        end_at: 1538834400,
      },
    ],
  },
];
@Injectable()
export class SalonsService {
  getTimeSlots(body: GetTimeSlotsRequestDto) {
    return MOCK_DATA;
  }
}
