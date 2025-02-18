import { DayTimetableDto } from 'src/modules/salons/dto/day-timetable.dto';

/**
 * DTO for returning time slots data with day timetables
 */
export class GetTimeSlotsResponseDto extends Array<DayTimetableDto> {}
