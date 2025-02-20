import { SalonDayTimetableDto } from '##salons/dto/salon-day-timetable.dto';

/**
 * DTO for returning time slots data with day timetables
 */
export class GetTimeSlotsResponseDto extends Array<SalonDayTimetableDto> {}
